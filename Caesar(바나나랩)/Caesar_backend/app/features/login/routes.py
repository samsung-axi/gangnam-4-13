# login/routes.py
# 로그인/인증 관련 라우터
import uuid
from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from ...database import get_db, SessionLocal
from .auth import TOK2UID, dev_auth
from .schemas import DevLoginBody, MemberOut, MemberUpdateIn, ApiKeysIn, ApiKeysMasked
from .crypto import encrypt_value, decrypt_value, mask_token
from .security import verify_password

router = APIRouter(prefix="/users", tags=["users"])

def _row_to_member_out(row) -> MemberOut:
    """SQLAlchemy Row -> MemberOut 변환 (새 스키마 방식)"""
    return MemberOut(
        userId=row["user_id"],           # row.user_id -> row["user_id"] 변경
        id=row["id"],
        name=row["name"], 
        role=row["role"],
        birth=row["birth"].isoformat() if row["birth"] else None,
        dept=row["dept"],                # 부서명은 조인으로 가져온 값
        rank=row["job_rank"],            # 직급명은 조인으로 가져온 값
        email=row["email"],
        mobile=row["mobile"],
    )

@router.post("/dev-login")
def dev_login(body: DevLoginBody):
    """
    DEV 로그인: 새 스키마 방식으로 SQL 직접 조회
    - member.id로 사용자 조회 후 비밀번호 검증
    - 토큰 발급 후 메모리에 토큰→user_id 저장
    - role(admin/user)에 따른 redirect 힌트 제공
    """
    try:
        with SessionLocal() as db:
            # 부서/직급명까지 조인해서 한번에 조회
            row = db.execute(text("""
                SELECT m.user_id, m.id, m.name, m.birth, m.role, m.email, m.mobile, m.password,
                       d.dept_name as dept, j.rank_name as job_rank
                FROM member m
                LEFT JOIN department d ON m.dept_id = d.dept_id
                LEFT JOIN job_rank j ON m.rank_id = j.rank_id
                WHERE m.id = :id
                LIMIT 1
            """), {"id": body.id}).mappings().first()
    except Exception as e:
        print(f"❌ 데이터베이스 조회 오류: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    if not row:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # 비밀번호 검증(bcrypt/평문 겸용)
    if not verify_password(body.password, row["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 토큰 발급 및 저장
    token = f"dev-{uuid.uuid4()}"
    TOK2UID[token] = row["user_id"]

    # 사용자 정보와 리다이렉트 페이지 결정
    user = _row_to_member_out(row).model_dump()
    redirect_page = "admin-dashboard" if row["role"] == "admin" else "user-home"
    
    return {"accessToken": token, "user": user, "redirect": redirect_page, "authMode": "DEV"}

@router.post("/logout")
def logout(user_id: int = Depends(dev_auth)):
    """
    로그아웃: 현재 토큰을 메모리에서 제거
    - DEV 모드에서는 TOK2UID에서 토큰 삭제
    - 토큰이 무효화되어 이후 요청 시 401 오류 발생
    """
    # 현재 사용자의 모든 토큰 찾기 (같은 user_id를 가진 토큰들)
    tokens_to_remove = [token for token, uid in TOK2UID.items() if uid == user_id]
    
    # 해당 토큰들을 메모리에서 제거
    for token in tokens_to_remove:
        del TOK2UID[token]
    
    return {
        "status": "ok", 
        "message": "Successfully logged out",
        "removed_tokens": len(tokens_to_remove)
    }

@router.get("/me", response_model=MemberOut)
def get_me(user_id: int = Depends(dev_auth), db: Session = Depends(get_db)):
    """현재 로그인 사용자 정보 조회 - 새 스키마 방식으로 SQL 직접 조회"""
    row = db.execute(text("""
        SELECT m.user_id, m.id, m.name, m.birth, m.role, m.email, m.mobile,
               d.dept_name as dept, j.rank_name as job_rank
        FROM member m
        LEFT JOIN department d ON m.dept_id = d.dept_id
        LEFT JOIN job_rank j ON m.rank_id = j.rank_id
        WHERE m.user_id = :uid
        LIMIT 1
    """), {"uid": user_id}).mappings().first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Member not found")
    return _row_to_member_out(row)

@router.put("/me", response_model=MemberOut)
def update_me(payload: MemberUpdateIn, user_id: int = Depends(dev_auth), db: Session = Depends(get_db)):
    """
    현재 로그인 사용자의 일부 필드 업데이트 - 새 스키마 방식
    - 허용: name, birth(YYYY-MM-DD), dept, rank, email, mobile
    - 동적 SET 절 구성
    """
    fields = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    # 문자열 'YYYY-MM-DD' 를 date 객체로 변환(있을 경우)
    if "birth" in fields and fields["birth"]:
        fields["birth"] = date.fromisoformat(fields["birth"])

    # 부서/직급명으로 들어오면 FK로 변환
    if "dept" in fields:
        dept_name = fields.pop("dept")
        dept_row = db.execute(text("SELECT dept_id FROM department WHERE dept_name = :name"), {"name": dept_name}).first()
        fields["dept_id"] = dept_row[0] if dept_row else None
    if "rank" in fields:
        rank_name = fields.pop("rank")
        rank_row = db.execute(text("SELECT rank_id FROM job_rank WHERE rank_name = :name"), {"name": rank_name}).first()
        fields["rank_id"] = rank_row[0] if rank_row else None

    # 동적 SET 절 구성하여 업데이트
    set_clause = ", ".join(f"{k} = :{k}" for k in fields.keys())
    fields["uid"] = user_id
    
    db.execute(text(f"UPDATE member SET {set_clause} WHERE user_id = :uid"), fields)
    db.commit()

    return get_me(user_id=user_id, db=db)  # 최신값 재조회

@router.put("/me/apis")
def set_my_apis(apis: ApiKeysIn, user_id: int = Depends(dev_auth), db: Session = Depends(get_db)):
    """
    외부 연동 API 키 저장 규칙 - 기존 DB 스키마와 호환
    - None  : 해당 컬럼을 NULL로 초기화  
    - ""    : 무시(변경 없음)
    - 그 외 : AES 암호화 후 BYTEA로 저장
    """
    sets, params = [], {"uid": user_id}

    def handle(field: str, value: str | None):
        if value is None:
            sets.append(f"{field} = NULL")
        elif value != "":
            sets.append(f"{field} = :{field}")
            params[field] = encrypt_value(value)

    handle("notion_api", apis.notion_api)
    handle("slack_api", apis.slack_api)
    handle("google_calendar_api", apis.google_calendar_api)  # 기존 DB 스키마 유지
    handle("google_drive_api", apis.google_drive_api)        # 기존 DB 스키마 유지

    if not sets:
        raise HTTPException(status_code=400, detail="No API keys to update")

    sql = f"UPDATE member SET {', '.join(sets)} WHERE user_id = :uid"
    db.execute(text(sql), params)  # text() 추가
    db.commit()
    return {"status": "ok"}

@router.get("/me/apis", response_model=ApiKeysMasked)
def get_my_apis(user_id: int = Depends(dev_auth), db: Session = Depends(get_db)):
    """마스킹된 연동 키 조회 - 기존 DB 스키마와 호환"""
    row = db.execute(text(
        "SELECT notion_api, slack_api, google_calendar_api, google_drive_api FROM member WHERE user_id = :uid"
    ), {"uid": user_id}).mappings().first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Member not found")

    return {
        "notion_api": mask_token(decrypt_value(row["notion_api"])),
        "slack_api":  mask_token(decrypt_value(row["slack_api"])),
        "google_calendar_api": mask_token(decrypt_value(row["google_calendar_api"])),  # 기존 DB 스키마 유지
        "google_drive_api": mask_token(decrypt_value(row["google_drive_api"])),        # 기존 DB 스키마 유지
    }

@router.delete("/me/apis")
def clear_my_apis(
    # 기존 DB와 호환성을 위해 기존 필드 사용
    keys: List[str] = Query(..., description="초기화할 키들: notion_api / slack_api / google_calendar_api / google_drive_api"),
    user_id: int = Depends(dev_auth),
    db: Session = Depends(get_db),
):
    """선택한 연동 키만 NULL로 초기화 - 기존 DB 스키마와 호환"""
    allowed = {"notion_api", "slack_api", "google_calendar_api", "google_drive_api"}  # 기존 DB 스키마 유지
    bad = [k for k in keys if k not in allowed]
    if bad:
        raise HTTPException(status_code=400, detail=f"Invalid keys: {bad}")

    set_clause = ", ".join(f"{k} = NULL" for k in keys)
    db.execute(text(f"UPDATE member SET {set_clause} WHERE user_id = :uid"), {"uid": user_id})  # text() 추가
    db.commit()
    return {"status": "ok", "cleared": keys}
