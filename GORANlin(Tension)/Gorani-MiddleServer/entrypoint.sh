#!/bin/bash

# ✅ FastAPI 실행 (백그라운드 실행)
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# ✅ Celery 실행 (Windows 호환성을 위해 --pool=solo 추가)
celery -A app.celery_worker worker --loglevel=info --pool=solo
