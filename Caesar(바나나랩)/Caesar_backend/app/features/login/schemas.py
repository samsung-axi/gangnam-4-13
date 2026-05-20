# login/schemas.py
# 로그인 관련 요청/응답 스키마
from typing import Optional
from pydantic import BaseModel

class DevLoginBody(BaseModel):
    id: str
    password: str  # 비밀번호 필드 추가 - 가짜 토큰 발급 전 비밀번호 검증용

class MemberOut(BaseModel):
    userId: int
    id: str
    name: str
    role: str
    birth: Optional[str] = None
    dept: Optional[str] = None   # 부서명
    rank: Optional[str] = None   # 직급명
    email: Optional[str] = None
    mobile: Optional[str] = None

class MemberUpdateIn(BaseModel):
    name: Optional[str] = None
    birth: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    dept: Optional[str] = None   # 선택: 부서명으로 업데이트
    rank: Optional[str] = None   # 선택: 직급명으로 업데이트

class ApiKeysIn(BaseModel):
    # 기존 DB와 호환성을 위해 기존 필드 사용
    notion_api: Optional[str] = None
    slack_api: Optional[str] = None
    google_calendar_api: Optional[str] = None  # 기존 DB 스키마 유지
    google_drive_api: Optional[str] = None     # 기존 DB 스키마 유지

class ApiKeysMasked(BaseModel):
    # 기존 DB와 호환성을 위해 기존 필드 사용  
    notion_api: Optional[str] = None
    slack_api: Optional[str] = None
    google_calendar_api: Optional[str] = None  # 기존 DB 스키마 유지
    google_drive_api: Optional[str] = None     # 기존 DB 스키마 유지
