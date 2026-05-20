#!/usr/bin/env python3
"""
간단한 Chatbot Backend 서버 시작 스크립트
(reload 없이 안정적 실행)
"""

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"🤖 Chatbot Backend 서버 시작: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 API 문서: http://{settings.HOST}:{settings.PORT}/docs")
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False,  # 안정성을 위해 reload 비활성화
        log_level=settings.LOG_LEVEL.lower()
    )
