from test_style_transfer import create_generator, convert_with_ai
from formal_converter import init_formal_generator, convert_to_formal
from polite_converter import init_polite_generator, convert_to_polite

def init_ai():
    create_generator()
    init_formal_generator()
    init_polite_generator()

def convert_text(text: str, style: str) -> str:
    try:
        if style == "formal":
            return convert_to_formal(text)
        elif style == "polite":
            return convert_to_polite(text)
        return convert_with_ai(style, text)
    except Exception as e:
        print(f"AI 변환 중 오류 발생: {e}")
    
    if style == "pretty":
        return f"{text}에용~"
    elif style == "cute":
        return f"{text}~♥"
    elif style == "polite":
        return f"{text}입니다"
    elif style == "formal":
        return f"{text}하십니다"
    elif style == "friendly":
        return f"{text}야"
    return text 