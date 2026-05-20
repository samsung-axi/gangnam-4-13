import os
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from pydub import AudioSegment
import librosa
import Levenshtein

def wer(reference, hypothesis):
    # 리스트 형태의 입력을 문자열로 변환
    if isinstance(reference, list):
        reference = " ".join(reference)
    if isinstance(hypothesis, list):
        hypothesis = " ".join(hypothesis)
    
    # 레벤슈타인 거리 계산
    distance = Levenshtein.distance(reference, hypothesis)
    
    # WER 계산
    return distance / len(reference.split())

# 모델 ID
MODEL_ID = "jonatasgrosman/wav2vec2-large-xlsr-53-english"

# 모델과 프로세서 로드
processor = Wav2Vec2Processor.from_pretrained(MODEL_ID)
model = Wav2Vec2ForCTC.from_pretrained(MODEL_ID)

# 현재 스크립트의 디렉토리 가져오기
current_dir = os.path.dirname(os.path.abspath(__file__))

# 상대 경로 설정 (static 폴더 내부)
before_path1 = os.path.join(current_dir, "../static/astronaut_en.mp3")
before_path2 = os.path.join(current_dir, "../static/astronaut_en.mp3")
wav_path1 = os.path.join(current_dir, "../static/astronaut.wav")
wav_path2 = os.path.join(current_dir, "../static/recorded_audio.wav")

# 파일 존재 여부 확인
if not os.path.exists(before_path1):
    raise FileNotFoundError(f"File not found: {before_path1}")
if not os.path.exists(before_path2):
    raise FileNotFoundError(f"File not found: {before_path2}")

# before_path의 확장자 추출
file_extension1 = os.path.splitext(before_path1)[1][1:]
file_extension2 = os.path.splitext(before_path2)[1][1:]

# WAV 변환
audio1 = AudioSegment.from_file(before_path1, format=file_extension1)
audio2 = AudioSegment.from_file(before_path2, format=file_extension2)
audio1.export(wav_path1, format="wav")
audio2.export(wav_path2, format="wav")

# 오디오 파일 로드 및 전처리
speech_array1, sampling_rate = librosa.load(wav_path1, sr=16000)
inputs1 = processor(speech_array1, sampling_rate=16000, return_tensors="pt", padding=True)

speech_array2, sampling_rate = librosa.load(wav_path2, sr=16000)
inputs2 = processor(speech_array2, sampling_rate=16000, return_tensors="pt", padding=True)

# 모델 추론
with torch.no_grad():
    logits1 = model(inputs1.input_values, attention_mask=inputs1.attention_mask).logits
    logits2 = model(inputs2.input_values, attention_mask=inputs2.attention_mask).logits

# 예측된 텍스트 디코딩 (첫 번째 요소 선택)
transcription1 = processor.batch_decode(logits1.argmax(dim=-1))[0]
transcription2 = processor.batch_decode(logits2.argmax(dim=-1))[0]

# WER 계산
error_rate = wer(transcription1, transcription2)
print("Word Error Rate (WER):", error_rate)
