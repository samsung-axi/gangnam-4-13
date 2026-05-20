# login/auth.py
# DEV 모드용 토큰 인증: Bearer 토큰 존재+매핑 확인
import os
from typing import Dict
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

AUTH_MODE = os.getenv("AUTH_MODE", "DEV").upper()
bearer = HTTPBearer(auto_error=False)
TOK2UID: Dict[str, int] = {}

def dev_auth(credentials: HTTPAuthorizationCredentials = Security(bearer)) -> int:
    if AUTH_MODE != "DEV":
        raise HTTPException(status_code=501, detail="DEV auth disabled")
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Missing token")
    uid = TOK2UID.get(credentials.credentials)
    if not uid:
        raise HTTPException(status_code=401, detail="Unknown token")
    return uid
