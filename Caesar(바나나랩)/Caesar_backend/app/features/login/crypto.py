"""
login/crypto.py
AES-256-GCM 암복호 유틸
- BYTEA 컬럼에 저장할 바이트를 생성/복원
- 마스킹 유틸(뒤 6자리만 노출)
"""
import os
from Crypto.Cipher import AES
from ...config import get_settings

_key = get_settings().enc_key  # 32바이트 키

# 저장 포맷: nonce(12) | tag(16) | ciphertext(n)


def encrypt_value(plaintext: str | None) -> bytes | None:
    """문자열을 암호화하여 bytes 반환(None은 그대로 None)"""
    if plaintext is None:
        return None
    nonce = os.urandom(12)
    cipher = AES.new(_key, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode("utf-8"))
    return nonce + tag + ciphertext


def decrypt_value(blob: bytes | None) -> str | None:
    """BYTEA에 저장된 암호문을 복호화하여 문자열 반환"""
    if not blob:
        return None
    nonce, tag, ciphertext = blob[:12], blob[12:28], blob[28:]
    cipher = AES.new(_key, AES.MODE_GCM, nonce=nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    return plaintext.decode("utf-8")


def mask_token(value: str | None) -> str | None:
    """민감키 마스킹(뒤 6자리만 표시)"""
    if not value:
        return None
    return "****" + value[-6:] if len(value) > 6 else "*" * len(value)
