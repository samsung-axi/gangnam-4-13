# Docker Run Guide (emart_crawl)

## 1) Prerequisites
- Docker & Docker Compose v2+

## 2) Project Overview
- Detected Python project: True
- FastAPI detected: True
- Streamlit detected: False
- Likely entrypoint (FastAPI): `main.py`

## 3) Build & Run (FastAPI default)
```bash
docker compose build
docker compose up -d
# API will be exposed on http://localhost:8000
```

> If your app is not FastAPI-based, override the command:
```bash
docker compose run --rm app python <your_script>.py
```

## 4) Environment Variables
- Put your secrets into `.env` at the project root (same dir as `docker-compose.yml`)

## 5) Development Tips
- The project root is mounted into the container (`./:/app`), so code changes reflect immediately.
- If you need additional OS packages, edit `Dockerfile` (apt-get section).

## 6) Health Check
- The default CMD tries to run a FastAPI app using `uvicorn` if detected.
- Otherwise, it idles. Customize `CMD` as needed.
