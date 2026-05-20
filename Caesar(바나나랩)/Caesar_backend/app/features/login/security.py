# login/security.py
# 비밀번호 해시/검증 (bcrypt)
import bcrypt

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, stored: str | None) -> bool:
    if not stored:
        return False
    if stored.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt.checkpw(plain.encode("utf-8"), stored.encode("utf-8"))
        except Exception:
            return False
    # 과거 평문 호환(MVP)
    return plain == stored
