# ✅ Python 3.10 기반 이미지 사용
FROM python:3.10

# ✅ 작업 디렉토리 생성
WORKDIR /app

# ✅ 필수 패키지 설치
COPY requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt  

# ✅ 애플리케이션 코드 복사
COPY . .  

# ✅ 실행 스크립트 추가 (FastAPI + Celery 동시 실행)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


# ✅ 컨테이너 실행 시 entrypoint.sh 실행
CMD ["/entrypoint.sh"]


