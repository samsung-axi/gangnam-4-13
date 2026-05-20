from app.repository.db_repository import DBRepository
from app.services.translation import translate_text
from app.services.textToVoice import generate_tts
import os
import asyncio

class SavedAllCard:
    def __init__(self, repository:DBRepository):
        self.repository = repository
        
    async def get_allwords_with_processing(self):
        """
        DB에 저장되어있는 모든 단어를 가져옵니다.
        """
        try:
            # MongoDB에서 모든 문서 조회
            allwords = await self.repository.get_all_items("items")
            
            processed_items = []
            
            for word in allwords:
                name_en = word['word']
                image_path = word['path']
                
                # 번역 (영어 -> 한국어)
                translated_ko = translate_text(name_en)
                
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
            print(f"Error in get_allwords_with_processing: {e}")
            return []