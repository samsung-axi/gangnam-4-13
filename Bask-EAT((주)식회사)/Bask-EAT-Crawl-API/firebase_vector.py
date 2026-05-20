import firebase_admin
from firebase_admin import credentials, firestore
import requests
from requests.adapters import HTTPAdapter, Retry
from dotenv import load_dotenv
import os
from typing import Optional
from threading import Event


def _clean_server_url(raw: str) -> str:
    if not raw:
        return ""
    # .env에 "https://..."처럼 따옴표가 들어간 경우 제거
    s = raw.strip().strip('"').strip("'")
    # 끝의 / 제거 후 엔드포인트 붙일 때 다시 추가
    return s.rstrip("/")


def _should_stop(ev: Optional[Event]) -> bool:
    return bool(ev and ev.is_set())


def build_session() -> requests.Session:
    s = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["POST", "GET"],
    )
    adapter = HTTPAdapter(max_retries=retries)
    s.mount("http://", adapter)
    s.mount("https://", adapter)
    s.headers.update({"Content-Type": "application/json"})
    return s


def main(stop_event: Optional[Event] = None):
    load_dotenv()

    # 1) Firebase init (idempotent)
    if not firebase_admin._apps:
        cred = credentials.Certificate("repository/serviceAccountKey.json")
        firebase_admin.initialize_app(cred)

    db = firestore.client()

    # 2) EMB 서버 정리
    raw_server = os.environ.get("EMB_SERVER", "")
    server = _clean_server_url(raw_server)
    if not server:
        raise RuntimeError("EMB_SERVER 환경변수가 비어있습니다. (.env 확인)")

    endpoint = f"{server}/string2vec"
    session = build_session()

    rag_products_ref = db.collection("rag_products")
    batch_size = 500

    last_doc = None
    processed_total = 0

    while True:
        if _should_stop(stop_event):
            print("중단 요청 감지: 루프 종료")
            break

        query = rag_products_ref.limit(batch_size)
        if last_doc:
            query = query.start_after(last_doc)

        docs = list(query.stream())
        if not docs:
            break

        last_processed_doc = None  # 이번 페이지에서 실제로 처리한 마지막 문서
        for doc in docs:
            if _should_stop(stop_event):
                print("중단 요청 감지: 문서 루프 종료")
                break

            data = doc.to_dict() or {}
            # 이미 임베딩 존재하면 스킵(빈 배열/None은 미존재로 간주)
            if data.get("embedding"):
                print(f"[skip] {doc.id} 이미 embedding 존재")
                last_processed_doc = doc
                continue

            # 벡터 대상 문자열 구성: query 있으면 그걸, 없으면 id로
            text = data.get("query") or data.get("id") or ""
            if not text:
                print(f"[skip] {doc.id} 벡터화할 문자열 없음")
                last_processed_doc = doc
                continue

            try:
                resp = session.post(endpoint, json={"query": text}, timeout=10)
                resp.raise_for_status()
                embedding_vector = (resp.json() or {}).get("results")
                if not embedding_vector:
                    print(f"[warn] {doc.id} 벡터 응답 비어있음")
                    last_processed_doc = doc
                    continue

                db.collection("rag_products").document(doc.id).update(
                    {
                        "embedding": embedding_vector
                        # 필요 시 상태 플래그도:
                        # "is_emb": "Y"
                    }
                )
                processed_total += 1
                print(f"[ok] {doc.id} embedding 추가 완료 (누적 {processed_total})")

            except Exception as e:
                # 실패 시 다음 문서로 진행 (로그만 남김)
                print(f"[error] {doc.id} 벡터화 실패: {e}")

            last_processed_doc = doc

        # 중요한 포인트:
        #   다음 페이지로 넘어갈 기준은 “가장 마지막으로 **실제로** 처리한 문서”
        #   중간에 break 되더라도, 그 전까지 처리한 문서까지만 커서 이동
        if last_processed_doc is not None:
            last_doc = last_processed_doc
        else:
            # 한 건도 처리 못 했으면(예: 즉시 취소), 안전하게 현재 페이지의 마지막 문서로 이동
            last_doc = docs[-1]

    print(f"총 처리 개수: {processed_total}")
    print("batch 처리 및 벡터화 완료.")


if __name__ == "__main__":
    # 단독 실행 시에는 stop_event 없이 실행
    main()
