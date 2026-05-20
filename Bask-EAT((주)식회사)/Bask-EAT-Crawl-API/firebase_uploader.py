import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
import glob
import sys
import requests
from requests.exceptions import SSLError, RequestException
from dotenv import load_dotenv
from typing import Optional
from threading import Event
from urllib.parse import urlparse


def initialize_firebase():
    """Firebase Admin SDK를 초기화합니다."""
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("repository/serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK가 성공적으로 초기화되었습니다.")
    except Exception as e:
        print(f"Firebase 초기화 중 오류가 발생했습니다: {e}")
        raise


def get_db():
    """Firestore 클라이언트 인스턴스를 반환합니다."""
    return firestore.client()


def update_price_history(
    db, product_id, out_of_stock, quantity, last_updated, price_info
):
    """
    가격을 비교하여, 변경 시에만 price_history를 업데이트하고 상태를 반환합니다.
    - 'updated': 가격이 변경되어 history가 추가됨
    - 'skipped': 가격이 동일하여 history는 추가되지 않음 (상위 필드는 갱신됨)
    """
    price_ref = db.collection("emart_price").document(product_id)
    try:
        doc = price_ref.get()
        price_history = doc.to_dict().get("price_history", []) if doc.exists else []

        price_has_changed = True
        if price_history:
            last_record = price_history[-1]
            if last_record.get("original_price") == price_info.get(
                "original_price"
            ) and last_record.get("selling_price") == price_info.get("selling_price"):
                price_has_changed = False

        top_level_update_data = {
            "id": product_id,
            "out_of_stock": out_of_stock,
            "quantity": quantity,
            "last_updated": last_updated,
        }

        if price_has_changed:
            price_history.append(price_info)
            top_level_update_data["price_history"] = price_history
            price_ref.set(top_level_update_data, merge=True)
            return "updated"
        else:
            price_ref.set(top_level_update_data, merge=True)
            return "skipped"

    except Exception as e:
        print(f"상품 ID '{product_id}'의 가격 업데이트 중 오류 발생: {e}")
        return "error"


def _should_stop(ev: Optional[Event]) -> bool:
    return bool(ev and ev.is_set())


def _notify_embedding_server(counters: dict):
    """
    업로드 종료 후 임베딩 서버에 신호를 보냅니다.
    .env 설정:
      - EMB_SERVER      : http://localhost:8000
      - EMB_ENDPOINT    : 기본 "/"
      - EMB_METHOD      : "GET" 또는 "POST" (기본 "GET")
      - EMB_VERIFY_SSL  : "true"|"false" (기본 "true")
      - EMB_TIMEOUT     : 초(float, 기본 "10")
    HTTPS 로컬(https://localhost:...) 오입력 시 HTTP 폴백 시도.
    """
    load_dotenv()
    base = (os.getenv("EMB_SERVER") or "").strip().strip('"')
    if not base:
        print("경고: .env 파일에 EMB_SERVER 환경변수가 설정되지 않았습니다.")
        return

    endpoint = (os.getenv("EMB_ENDPOINT") or "/").strip() or "/"
    method = (os.getenv("EMB_METHOD") or "GET").strip().upper()
    verify_ssl = os.getenv("EMB_VERIFY_SSL", "true").lower() == "true"
    try:
        timeout = float(os.getenv("EMB_TIMEOUT", "10"))
    except ValueError:
        timeout = 10.0

    url = base.rstrip("/") + (endpoint if endpoint.startswith("/") else f"/{endpoint}")

    payload = {
        "source": "emart_uploader",
        "event": "upload_completed",
        "counters": counters or {},
    }

    def _request(u: str):
        if method == "POST":
            return requests.post(u, json=payload, timeout=timeout, verify=verify_ssl)
        else:
            return requests.get(u, timeout=timeout, verify=verify_ssl)

    print(
        f"\n>> 모든 업로드 작업 완료. 임베딩 서버에 시작 신호를 보냅니다... ({method} {url})"
    )
    try:
        resp = _request(url)
        resp.raise_for_status()
        print(
            f"임베딩 서버에 성공적으로 신호를 보냈습니다. (상태 코드: {resp.status_code})"
        )
        return
    except SSLError as e:
        # HTTPS 로컬 오입력 자동 폴백 (https -> http)
        parsed = urlparse(url)
        if parsed.scheme == "https" and parsed.hostname in ("localhost", "127.0.0.1"):
            fallback = url.replace("https://", "http://", 1)
            print(f"SSL 오류 감지, 로컬 HTTPS → HTTP 폴백 시도: {fallback}")
            try:
                # 로컬 HTTP는 대개 verify 의미 없음
                if method == "POST":
                    resp = requests.post(fallback, json=payload, timeout=timeout)
                else:
                    resp = requests.get(fallback, timeout=timeout)
                resp.raise_for_status()
                print(
                    f"임베딩 서버 신호 OK (HTTPS→HTTP 폴백, 코드: {resp.status_code})"
                )
                return
            except RequestException as e2:
                print(f"임베딩 서버 폴백 실패: {e2}")
        else:
            print(f"임베딩 서버 SSL 오류: {e}")
    except RequestException as e:
        print(f"임베딩 서버 호출 실패: {e}")


def upload_json_to_firestore(directory_path: str, stop_event: Optional[Event] = None):
    """
    지정된 디렉토리의 모든 JSON 파일을 Firestore에 업로드합니다.
    stop_event가 set되면 가능한 빠르게 중단(협조적 취소)합니다.
    - 중단 시: 현재 처리 중이던 JSON 파일은 삭제하지 않고 남겨둡니다(복구/재시도용).
    - 이미 끝난 파일은 기존대로 삭제됩니다.
    """
    if _should_stop(stop_event):
        return {"status": "stopped", "message": "작업 시작 전에 중단됨"}

    try:
        initialize_firebase()
    except Exception as e:
        return {"status": "error", "error": str(e)}

    db = get_db()
    beacon = (
        1
        if directory_path == "result_json"
        else 2 if directory_path == "result_price_json" else 3
    )

    try:
        json_files = glob.glob(os.path.join(directory_path, "*.json"))
        if not json_files:
            return {
                "status": "warning",
                "message": f"'{directory_path}' 폴더에 JSON 파일이 없습니다.",
            }

        price_updated_count = 0
        price_skipped_count = 0
        product_new_count = 0
        product_updated_count = 0
        product_skipped_count = 0

        for json_file in json_files:
            if _should_stop(stop_event):
                print("중단 요청 감지: 파일 루프 종료")
                return {
                    "status": "stopped",
                    "message": "업로드 중단됨(파일 루프)",
                    "counters": {
                        "price_updated": price_updated_count,
                        "price_skipped": price_skipped_count,
                        "product_new": product_new_count,
                        "product_updated": product_updated_count,
                        "product_skipped": product_skipped_count,
                    },
                }

            with open(json_file, "r", encoding="utf-8") as f:
                products = json.load(f)

            print(f"\n파일 '{json_file}'의 데이터를 Firestore에 업로드합니다.")

            stopped_in_file = False
            for product in products:
                if _should_stop(stop_event):
                    print("중단 요청 감지: 문서 루프 종료(현재 파일은 삭제하지 않음)")
                    stopped_in_file = True
                    break

                product_id = product.get("id")
                if not product_id:
                    continue

                if beacon in (1, 2):
                    price_info = {
                        "original_price": product.get("original_price"),
                        "selling_price": product.get("selling_price"),
                        "last_updated": product.get("last_updated"),
                    }
                    result = update_price_history(
                        db,
                        product_id,
                        product.get("out_of_stock"),
                        product.get("quantity"),
                        product.get("last_updated"),
                        price_info,
                    )
                    if result == "updated":
                        price_updated_count += 1
                        print(
                            f"가격 ID '{product_id}'가 업데이트 되었습니다 [{price_updated_count}]"
                        )
                    elif result == "skipped":
                        price_skipped_count += 1
                        print(
                            f"가격 ID '{product_id}'가 패스 되었습니다 [{price_skipped_count}]"
                        )

                if beacon in (1, 3):
                    product_ref = db.collection("emart_product").document(product_id)
                    try:
                        doc = product_ref.get()
                        if doc.exists:
                            existing_data = doc.to_dict()
                            if existing_data.get("product_name") != product.get(
                                "product_name"
                            ) or existing_data.get("image_url") != product.get(
                                "image_url"
                            ):
                                update_data = {
                                    "product_name": product.get("product_name"),
                                    "image_url": product.get("image_url"),
                                    "last_updated": product.get("last_updated"),
                                    "is_emb": "R",
                                }
                                product_ref.update(update_data)
                                product_updated_count += 1
                                print(
                                    f"상품 ID '{product_id}'가 업데이트 되었습니다 [{product_updated_count}]"
                                )
                            else:
                                product_ref.update(
                                    {"last_updated": product.get("last_updated")}
                                )
                                product_skipped_count += 1
                                print(
                                    f"상품 ID '{product_id}'가 패스 되었습니다 [{product_skipped_count}]"
                                )
                        else:
                            product_data = {
                                k: v
                                for k, v in product.items()
                                if k
                                in [
                                    "id",
                                    "category",
                                    "image_url",
                                    "last_updated",
                                    "product_address",
                                    "product_name",
                                ]
                            }
                            product_data["is_emb"] = "R"
                            product_ref.set(product_data)
                            product_new_count += 1
                    except Exception as e:
                        print(f"상품 문서 처리 중 오류(ID={product_id}): {e}")

            if stopped_in_file:
                return {
                    "status": "stopped",
                    "message": f"업로드 중단됨(파일: {os.path.basename(json_file)} 진행 중)",
                    "counters": {
                        "price_updated": price_updated_count,
                        "price_skipped": price_skipped_count,
                        "product_new": product_new_count,
                        "product_updated": product_updated_count,
                        "product_skipped": product_skipped_count,
                    },
                }
            else:
                try:
                    os.remove(json_file)
                except OSError as e:
                    print(f"파일 삭제 중 오류 발생: {e}")

        print("\n===== Firestore 업로드 최종 결과 =====")
        if beacon in (1, 2):
            print("--- 가격 정보 (emart_price) ---")
            print(f"  - 가격 변경되어 history 추가: {price_updated_count}개")
            print(f"  - 가격 동일하여 history 생략: {price_skipped_count}개")
        if beacon in (1, 3):
            print("--- 상품 정보 (emart_product) ---")
            print(f"  - 신규 추가된 상품: {product_new_count}개")
            print(f"  - 이름/이미지 변경된 상품: {product_updated_count}개")
            print(f"  - 변경 없어 시간만 갱신된 상품: {product_skipped_count}개")
        print("======================================")

        # 취소가 아니면 임베딩 서버에 알림
        if _should_stop(stop_event):
            print("\n>> 중단 요청 감지: 임베딩 서버 호출을 건너뜁니다.")
            return {
                "status": "stopped",
                "message": "업로드는 완료/부분완료, 임베딩 호출은 생략",
                "counters": {
                    "price_updated": price_updated_count,
                    "price_skipped": price_skipped_count,
                    "product_new": product_new_count,
                    "product_updated": product_updated_count,
                    "product_skipped": product_skipped_count,
                },
            }

        counters = {
            "price_updated": price_updated_count,
            "price_skipped": price_skipped_count,
            "product_new": product_new_count,
            "product_updated": product_updated_count,
            "product_skipped": product_skipped_count,
        }
        _notify_embedding_server(counters)

        return {
            "status": "success",
            "message": "All files uploaded successfully.",
            "counters": counters,
        }

    except Exception as e:
        print(f"Firestore 업로드 중 오류가 발생했습니다: {e}")
        return {"status": "error", "error": str(e)}


# === 래퍼: 기존 시그니처 유지 + stop_event 옵션 지원 ===
def upload_all_products_to_firebase(stop_event: Optional[Event] = None):
    return upload_json_to_firestore("result_json", stop_event)


def upload_id_price_to_firebase(stop_event: Optional[Event] = None):
    return upload_json_to_firestore("result_price_json", stop_event)


def upload_other_info_to_firebase(stop_event: Optional[Event] = None):
    return upload_json_to_firestore("result_non_price_json", stop_event)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "all":
            result = upload_all_products_to_firebase()
        elif command == "price":
            result = upload_id_price_to_firebase()
        elif command == "other":
            result = upload_other_info_to_firebase()
        else:
            print(
                "유효하지 않은 명령입니다. 다음 중 하나를 사용하세요: all, price, other"
            )
