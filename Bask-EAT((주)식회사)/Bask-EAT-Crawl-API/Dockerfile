# scrape/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    TZ=Asia/Seoul

RUN apt-get update && apt-get install -y --no-install-recommends curl tzdata \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip && pip install -r /app/requirements.txt

COPY . /app

RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8420

ENTRYPOINT ["uvicorn"]
CMD ["main:app", "--host", "0.0.0.0", "--port", "8420", "--workers", "2"]
