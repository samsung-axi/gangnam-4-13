from app.repository.db_repository import DBRepository
from app.services.translation import translate_text
from app.services.textToVoice import generate_tts
import os
import asyncio
import random

class randomCardService:
    def __init__(self, repository: DBRepository):
        self.repository = repository
        
    async def get_random_word_with_processing(self, collection: str) -> dict:
        """
        모든 단어 중에 랜덤으로 하나를 선택하고 조회한다.
        """
        try:
            # 데이터베이스에서 모든 단어를 가져오고 'savedmycard'를 제외한 필터링
            all_items = await self.repository.get_all_items(collection)
            filtered_items = [item for item in all_items if item.get('collection_name') != 'user1']

            if not filtered_items:  # 리스트가 비어 있는 경우
                print("No words found in the database.")
                return None  # None 반환

            # 전체 단어 중 랜덤으로 단어 선택
            random_word = random.choice(filtered_items)

            name_en = random_word['word']
            image_path = random_word['path']

            # 번역 (영어 -> 한국어)
            translated_ko = translate_text(name_en, dest_lang='ko') or "unknown"

            # TTS 생성 (영어)
            tts_en_filename = f"{os.path.splitext(os.path.basename(image_path))[0]}_en.mp3"
            await asyncio.to_thread(generate_tts, text=name_en, lang='en', file_name=tts_en_filename)

            # TTS 생성 (한국어)
            tts_ko_filename = f"{os.path.splitext(os.path.basename(image_path))[0]}_ko.mp3"
            await asyncio.to_thread(generate_tts, text=translated_ko, lang='ko', file_name=tts_ko_filename)

            # TTS URL 설정
            tts_en_url = f"/static/{tts_en_filename}"
            tts_ko_url = f"/static/{tts_ko_filename}"

            # 이미지 URL 설정
            image_url = f"/database/images/{os.path.basename(image_path)}"

            processed_item = {
                "id": str(random_word['_id']),
                "word": name_en,
                "translated_text": translated_ko,
                "path": image_url,
                "tts_en_url": tts_en_url,
                "tts_ko_url": tts_ko_url
            }

            return processed_item

        except Exception as e:
            print(f"Error in get_random_word_with_processing: {e}")
            return None  # 오류 발생 시 None 반환


    async def compare_audio_files(self, file1_path: str, file2_path: str) -> str:
        """
        두 음성 파일의 유사도 계산 (비동기)
        """
        try:
            from app.services.similarity import compare_audio_files
            similarity = await asyncio.to_thread(compare_audio_files, file1_path, file2_path)
            return similarity
        except Exception as e:
            print(f"Error in compare_audio_files: {e}")
            return "유사도 계산 중 오류가 발생했습니다."
