from app.repository.db_repository import DBRepository
from app.services.translation import translate_text
from app.services.textToVoice import generate_tts
import os
import asyncio

class SavedMyCardService:
    def __init__(self, repository: DBRepository):
        self.repository = repository

    async def get_mywords_with_processing(self):
        """
        username이 'user1'인 모든 단어를 가져와 번역 및 TTS 생성을 수행합니다.
        """
        try:
            # MongoDB에서 username이 'user1'인 모든 문서 조회
            mywords = await self.repository.get_item_by_username("items", "user100")

            processed_items = []

            for word in mywords:
                name_en = word['word']
                image_path = word['path']

                # 번역 (영어 -> 한국어)
                translated_ko = translate_text(name_en, dest_lang='ko') or "unknown"

                # TTS 생성 (영어)
                tts_en_filename = f"{os.path.splitext(os.path.basename(image_path))[0]}_en.mp3"
                tts_en_path = os.path.join("app/static/", tts_en_filename)
                await asyncio.to_thread(generate_tts, text=name_en, lang='en', file_name=tts_en_filename)

                # TTS 생성 (한국어)
                tts_ko_filename = f"{os.path.splitext(os.path.basename(image_path))[0]}_ko.mp3"
                tts_ko_path = os.path.join("app/static/", tts_ko_filename)
                await asyncio.to_thread(generate_tts, text=translated_ko, lang='ko', file_name=tts_ko_filename)

                # TTS URL 설정
                tts_en_url = f"/static/{tts_en_filename}"
                tts_ko_url = f"/static/{tts_ko_filename}"

                # 이미지 URL 설정
                image_url = f"/database/images/{os.path.basename(image_path)}"

                processed_item = {
                    "id": str(word['_id']),
                    "word": name_en,
                    "translated_text": translated_ko,
                    "path": image_url,
                    "tts_en_url": tts_en_url,
                    "tts_ko_url": tts_ko_url
                }

                processed_items.append(processed_item)

            return processed_items

        except Exception as e:
            print(f"Error in get_mywords_with_processing: {e}")
            return []

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
