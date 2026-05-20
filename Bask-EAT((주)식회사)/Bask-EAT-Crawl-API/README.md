# emart-crawl API (FastAPI)

이 프로젝트는 **이마트몰 상품 데이터**를 수집·정제하여 JSON/이미지로 저장하고, 필요 시 **Firebase Firestore** 및 **임베딩 서버**로 업로드/신호를 보내는 **운영용 크롤링 API**입니다.

- 백엔드: Python **FastAPI** + **APScheduler** (크론 스케줄)
- 파서: `requests` + **BeautifulSoup4**
- 업로드: **firebase-admin** (Firestore)


## 프로젝트 구조

```
.git/
Dockerfile
README.md
categories.json
developer.html
emart_image.py
emart_json.py
emart_non_price_json.py
emart_price_json.py
firebase_uploader.py
firebase_vector.py
main.py
repository/
requirements.txt
result_json/
result_non_price_json/
result_price_json/
명령어.txt
```

## 동작 개요

1) **크롤링**: `emart_json.py`, `emart_price_json.py`, `emart_non_price_json.py`가 각각 전체/가격/기타 정보를 수집하여 JSON으로 저장

2) **이미지 다운로드**: `emart_image.py`가 상품 이미지 저장

3) **업로드**: `firebase_uploader.py`, `firebase_vector.py`가 Firestore 업로드 및 임베딩 서버 호출

4) **스케줄러**: `main.py`가 FastAPI 앱과 APScheduler를 구동, 정시/매시 30분 작업 실행

## 빠른 시작

### 로컬 실행 (Python 3.10+ 권장)

```bash
python -m venv .venv
. .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# 환경변수 설정 (.env 파일)
cp .env.example .env   # 내용 확인/수정

# 개발 실행 (8420 포트를 권장)
uvicorn main:app --reload --host 0.0.0.0 --port 8420

# API 문서
# http://localhost:8420/docs
```

### Docker 실행

```bash
docker build -t emart-crawl:local .
docker run --env-file .env -p 8420:8420 --name emart-crawl emart-crawl:local
```

> ⚠️ **Dockerfile 주의**: 현재 `CMD ["uvicorn", "main1:app", ...]`로 되어 있으나, 저장소에는 `main1.py`가 없습니다.
> 다음과 같이 수정하는 것을 권장합니다:

```dockerfile
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8420"]
```

## CORS

`main.py`에서 `CORS_ALLOW_ORIGINS` 환경변수(쉼표 구분)를 읽어 허용 오리진을 설정합니다. 기본값은 `http://localhost:5173`입니다.

## 카테고리 관리

- 파일: `categories.json` (예: `{ "MealKits_ConvenienceFood": "6000213247" }`)
- 개발자 페이지: `developer.html` (브라우저에서 열어 API 호출)

## API (자동 추출)

| Method | Path | 핸들러 |
|---|---|---|

| `GET` | `/health` | `health` |
| `GET` | `/categories` | `get_categories` |
| `POST` | `/save_categories` | `save_categories` |
| `DELETE` | `/delete_categories` | `delete_categories` |
| `GET` | `/env` | `get_env` |
| `POST` | `/save_env` | `save_env` |
| `POST` | `/run_json` | `run_all_products` |
| `POST` | `/run_price_json` | `run_id_price` |
| `POST` | `/run_non_price_json` | `run_other_info` |
| `POST` | `/run_image` | `run_image` |
| `POST` | `/run_firebase_all` | `run_firebase_all` |
| `POST` | `/run_firebase_price` | `run_firebase_price` |
| `POST` | `/run_firebase_other` | `run_firebase_other` |
| `POST` | `/scheduler/on` | `resume_scheduler` |
| `POST` | `/scheduler/off` | `pause_scheduler` |
| `GET` | `/scheduler/status` | `scheduler_status` |
| `POST` | `/tasks/stop` | `tasks_stop` |
| `POST` | `/tasks/start` | `tasks_start` |
| `GET` | `/tasks/status` | `tasks_status` |
| `GET` | `/scheduler/config` | `get_scheduler_config` |
| `POST` | `/scheduler/config` | `set_scheduler_config` |
| `POST` | `/scheduler/run-now` | `scheduler_run_now` |

주요 동작:
- `/run_json`, `/run_price_json`, `/run_non_price_json`: 각 스크래핑 실행
- `/run_image`: 이미지 다운로드 실행
- `/run_firebase_*`: Firestore 업로드 및 임베딩 서버 신호
- `/scheduler/*`: 스케줄 켜기/끄기/상태/구성 변경 (기본 ALL=03:00, PRICE=매시 30분)
- `/categories`, `/save_categories`, `/delete_categories`: 카테고리 관리
- `/env`, `/save_env`: 페이지 범위 등 런타임 파라미터 관리

## 환경 변수 (.env)

감지된 키:

- `ALL_HOUR`
- `ALL_MINUTE`
- `CORS_ALLOW_ORIGINS`
- `EMART_EMPTY_PAGE_STOP`
- `EMART_END_PAGE`
- `EMART_PAGE_CAP`
- `EMART_PAGE_DELAY_SEC`
- `EMART_PARTIAL_SAVE_EVERY`
- `EMART_START_PAGE`
- `EMB_METHOD`
- `EMB_SERVER`
- `EMB_VERIFY_SSL`
- `PRICE_HOUR`
- `PRICE_MINUTE`

권장 기본값 예시:

```env
EMART_START_PAGE=1
EMART_END_PAGE=
EMART_PAGE_CAP=500
EMART_PAGE_DELAY_SEC=2.0
EMART_EMPTY_PAGE_STOP=2
EMART_PARTIAL_SAVE_EVERY=0

# 임베딩 서버
EMB_SERVER="http://localhost:8000/index/start"
EMB_METHOD=POST
EMB_VERIFY_SSL=false
EMB_TIMEOUT=10

# 스케줄(cron)
ALL_HOUR=3
ALL_MINUTE=0
PRICE_HOUR=
PRICE_MINUTE=30

# CORS
CORS_ALLOW_ORIGINS=http://localhost:5173
```

## 출력 위치

- JSON: `result_json/`, `result_price_json/`, `result_non_price_json/`
- 이미지: `result_image/`

파일명은 시간/카테고리 기준으로 생성되며, Firestore 업로드시 각 JSON이 참조됩니다.

## Firestore & 임베딩 서버 연동

- 서비스 계정 키는 **로컬 파일로 두지 말고** 환경변수/비밀 관리자로 전달하세요.
- 업로드 완료 후 **임베딩 서버(EMB_SERVER)**에 HTTP 요청으로 신호를 보냅니다. `EMB_METHOD`, `EMB_VERIFY_SSL`, `EMB_TIMEOUT`로 제어.

## 스케줄러 사용법

- 기동 시 APScheduler가 `.env` 기준으로 크론 잡 등록: `job_all`, `job_price`
- API로 즉시 실행: `POST /scheduler/run-now` (`{"job":"all"|"price"}`)
- 일시정지/재개: `POST /scheduler/off` / `POST /scheduler/on`
- 상태 조회: `GET /scheduler/status`

## 트러블슈팅

- **403 / 차단**: 요청 속도를 `EMART_PAGE_DELAY_SEC`로 조절하고, `EMART_PAGE_CAP`/`EMART_EMPTY_PAGE_STOP`로 무한 크롤 방지
- **네트워크 오류**: 리트라이 로직 내장(요청 어댑터/Retry). 임베딩 서버 URL에 따옴표가 포함되면 자동 제거
- **CORS 오류**: `CORS_ALLOW_ORIGINS`에 프론트 도메인을 추가
- **Docker 포트 충돌**: 컨테이너 `-p 8420:8420` 포트 매핑 조정

## 보안 주의

- **서비스 계정/민감 정보 커밋 금지**: `.gitignore`에 `*.json`(키), `.env*`, `*.pem` 포함
- GitHub Push Protection 경고가 뜨면 **키 회전 + 히스토리 삭제** 후 재푸시

## 라이선스
조직 정책에 따라 라이선스 문구를 추가하세요.
