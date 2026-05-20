from qwen.text_style_converter_qwen25_3b_instruct import init_pipeline, style_settings, convert_style
from datetime import datetime

if __name__ == "__main__":
    start_time = datetime.now()
    print(f"시작 시간: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    init_pipeline()
    
    # 테스트
    test_text = """2025년은 AI가 폭발적으로 성장하는 한 해가 될거야.
왜냐하면 AUNT가 본격적으로 프로젝트를 실행한 해니까."""
    
    print("원문:", test_text)
    print("\n각 스타일별 변환 결과:")
    
    loop_start_time = datetime.now()
    print(f"\n스타일 변환 시작 시간: {loop_start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    for style in style_settings.keys():
        print(f"\n[{style} 스타일]")
        print(convert_style(test_text, style))
        print("-" * 50)
    
    end_time = datetime.now()
    print(f"\n종료 시간: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"총 소요 시간: {end_time - start_time}")
    print(f"변환 소요 시간: {end_time - loop_start_time}")