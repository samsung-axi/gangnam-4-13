# app/services/translation.py
from googletrans import Translator
from typing import Optional

translator = Translator()

def translate_text(text: str, dest_lang: str = 'ko') -> Optional[str]:
    """
    영어 텍스트를 지정된 언어로 번역합니다.
    :param text: 번역할 영어 텍스트
    :param dest_lang: 번역할 언어 코드 (기본값 'ko' - 한국어)
    :return: 번역된 텍스트 또는 None
    """
    try:
        result = translator.translate(text, src='en', dest=dest_lang)
        return result.text
    except Exception as e:
        print(f"번역 오류: {e}")
        return None

def translate_lang(text: str, dest_lang: str) -> Optional[str]:
    """
    영어 텍스트를 지정된 언어로 번역합니다.
    :param text: 번역할 영어 텍스트
    :param dest_lang: 번역할 언어 코드 (기본값 'ko' - 한국어)
    :return: 번역된 텍스트 또는 None
    """
    try:
        result = translator.translate(text, src='en', dest=dest_lang)
        return result.text
    except Exception as e:
        print(f"번역 오류: {e}")
        return None
