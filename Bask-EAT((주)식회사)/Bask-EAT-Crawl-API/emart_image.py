import json
import requests
import os
import glob
import time
from typing import Optional
from dotenv import load_dotenv
from threading import Event


def find_all_json_files_in_directory(directory, pattern):
    return glob.glob(os.path.join(directory, pattern))


def download_images_from_json(
    json_filepath: str,
    output_base_dir: str = "result_image",
    stop_event: Optional[Event] = None,
    delay_sec: float = 0.1,
):
    """
    JSON 파일 내 이미지들을 다운로드.
    stop_event가 set되면 즉시 중단(협조적 취소).
    """

    def should_stop() -> bool:
        return bool(stop_event and stop_event.is_set())

    if should_stop():
        print("중단 요청 감지: download_images_from_json 시작 전 종료")
        return

    if not os.path.exists(json_filepath):
        print(f"오류: JSON 파일 '{json_filepath}'을(를) 찾을 수 없습니다.")
        return

    try:
        with open(json_filepath, "r", encoding="utf-8") as f:
            products_data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"오류: JSON 파일 '{json_filepath}' 파싱 실패: {e}")
        return

    if not products_data:
        print(f"경고: '{json_filepath}' 파일에 상품 데이터가 없습니다. 건너뜁니다.")
        return

    category_name = products_data[0].get("category", "unknown_category")
    output_dir = os.path.join(output_base_dir, category_name)

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"'{output_dir}' 디렉토리를 생성했습니다.")

    print(
        f"'{json_filepath}' 파일에서 총 {len(products_data)}개의 '{category_name}' 상품 이미지를 다운로드합니다."
    )

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/91.0.4472.124 Safari/537.36"
        )
    }

    for i, product in enumerate(products_data):
        if should_stop():
            print("중단 요청 감지: 이미지 루프 종료")
            return

        image_url = product.get("image_url")
        product_name = product.get("product_name", "알 수 없는 제품")

        if not image_url:
            print(
                f"[{i+1}/{len(products_data)}] '{product_name}' 이미지 주소 없음 → 건너뜀"
            )
            continue

        try:
            # 파일명 정리
            filename = os.path.basename(image_url)
            filename = filename.replace("_i1_290", "").replace("_i1_580", "")
            if "?" in filename:
                filename = filename.split("?", 1)[0]
            if "#" in filename:
                filename = filename.split("#", 1)[0]

            local_filepath = os.path.join(output_dir, filename)

            # 중단 체크 (네트워크 전에 한 번 더)
            if should_stop():
                print("중단 요청 감지: HEAD 요청 전 종료")
                return

            # HEAD로 예상 크기
            response_head = requests.head(image_url, headers=headers, timeout=10)
            response_head.raise_for_status()
            expected_size = int(response_head.headers.get("content-length", 0))

            # 기존 파일 크기 비교
            if os.path.exists(local_filepath):
                current_file_size = os.path.getsize(local_filepath)
                if current_file_size == expected_size and expected_size > 0:
                    print(
                        f"[{i+1}/{len(products_data)}] '{product_name}' '{filename}' (동일 크기) → 건너뜀"
                    )
                    # 다음 아이템으로
                    if delay_sec > 0:
                        # 중단 체크 + 짧은 대기
                        for _ in range(int(delay_sec / 0.05) or 1):
                            if should_stop():
                                print("중단 요청 감지: 대기 중 종료")
                                return
                            time.sleep(min(0.05, delay_sec))
                    continue
                else:
                    print(
                        f"[{i+1}/{len(products_data)}] '{product_name}' '{filename}' (크기 다름/0) → 덮어씀"
                    )
            else:
                print(
                    f"[{i+1}/{len(products_data)}] '{product_name}' '{filename}' → 다운로드"
                )

            if should_stop():
                print("중단 요청 감지: GET 요청 전 종료")
                return

            # 다운로드
            response_get = requests.get(image_url, headers=headers, timeout=15)
            response_get.raise_for_status()

            if should_stop():
                print("중단 요청 감지: 파일 저장 전 종료")
                return

            with open(local_filepath, "wb") as f:
                f.write(response_get.content)

        except requests.exceptions.RequestException as e:
            print(
                f"[{i+1}/{len(products_data)}] '{product_name}' 다운로드 오류 ({image_url}): {e}"
            )
        except Exception as e:
            print(
                f"[{i+1}/{len(products_data)}] '{product_name}' 처리 중 오류 ({image_url}): {e}"
            )

        # 짧은 딜레이 (중단 가능)
        if delay_sec > 0:
            for _ in range(int(delay_sec / 0.05) or 1):
                if should_stop():
                    print("중단 요청 감지: 대기 중 종료")
                    return
                time.sleep(min(0.05, delay_sec))

    print(f"\n'{category_name}' 카테고리의 이미지 다운로드 시도 완료.")


def run_emart_image(stop_event: Optional[Event] = None):
    """
    모든 JSON 파일에 대해 이미지 다운로드. stop_event로 중단 가능.
    """

    def should_stop() -> bool:
        return bool(stop_event and stop_event.is_set())

    load_dotenv(override=True)
    json_input_dir = "result_json"
    json_pattern = "*.json"

    if should_stop():
        print("중단 요청 감지: run_emart_image 시작 전 종료")
        return

    if not os.path.exists(json_input_dir):
        print(f"오류: JSON 폴더 '{json_input_dir}' 없음. 먼저 스크래핑을 실행하세요.")
        return

    json_files = find_all_json_files_in_directory(json_input_dir, json_pattern)

    if not json_files:
        print(f"오류: '{json_input_dir}'에서 '{json_pattern}'에 맞는 JSON이 없습니다.")
        return

    print(f"'{json_input_dir}'에서 총 {len(json_files)}개의 JSON 파일을 찾았습니다.")

    for json_file in json_files:
        if should_stop():
            print("중단 요청 감지: 파일 루프 종료")
            return
        download_images_from_json(json_file, stop_event=stop_event)

    print("\n===== 모든 JSON 파일 이미지 다운로드 완료 =====")


if __name__ == "__main__":
    run_emart_image()
