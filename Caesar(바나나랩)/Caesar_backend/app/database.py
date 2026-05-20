# backend/database.py
# MySQL 연결, ORM Base/Session, 앱 시작 시 테이블 생성 + 시드

import os
from pathlib import Path
from typing import Iterator
from datetime import date

from sqlalchemy import create_engine, select, String, BigInteger, Date, TIMESTAMP, func, ForeignKey, LargeBinary, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column, relationship

from .config import get_settings

settings = get_settings()

# MySQL 엔진 (PyMySQL)
engine = create_engine(
    settings.DB_URL, 
    pool_pre_ping=True, 
    future=True,
    echo=False  # SQL 로그 출력 (개발시에만)
)

# 세션 팩토리
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, future=True)

class Base(DeclarativeBase):
    pass

# ───────── ORM (snake_case 정규화) ─────────
class Department(Base):
    __tablename__ = "department"
    dept_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    dept_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

class JobRank(Base):
    __tablename__ = "job_rank"
    rank_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    rank_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

class Member(Base):
    __tablename__ = "member"
    user_id:  Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    id:       Mapped[str] = mapped_column(String(50), unique=True, nullable=False)      # 로그인 아이디
    password: Mapped[str] = mapped_column(String(255), nullable=False)                  # bcrypt 해시 저장
    name:     Mapped[str] = mapped_column(String(50), nullable=False)
    birth:    Mapped[date | None] = mapped_column(Date)
    dept_id:  Mapped[int | None] = mapped_column(ForeignKey("department.dept_id", onupdate="CASCADE", ondelete="SET NULL"))
    rank_id:  Mapped[int | None] = mapped_column(ForeignKey("job_rank.rank_id",   onupdate="CASCADE", ondelete="SET NULL"))
    role:     Mapped[str] = mapped_column(String(20), default="user", nullable=False)
    email:    Mapped[str | None] = mapped_column(String(255))
    mobile:   Mapped[str | None] = mapped_column(String(20))

    # 외부 연동 키(암호문 BYTEA) - DB 스키마와 정확히 일치
    notion_api:          Mapped[bytes | None] = mapped_column(LargeBinary)
    slack_api:           Mapped[bytes | None] = mapped_column(LargeBinary)
    google_calendar_api: Mapped[bytes | None] = mapped_column(LargeBinary)
    google_drive_api:    Mapped[bytes | None] = mapped_column(LargeBinary)

    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

# ───────── ddl-auto + seed ─────────
from .features.login.security import hash_password

def init_db_and_seed() -> None:
    """앱 시작 시: 테이블 생성 + 시드 데이터(없을 때만)"""
    try:
        # 데이터베이스 연결 테스트
        with engine.connect() as conn:
            print("✓ MySQL 데이터베이스 연결 성공")
        
        # 테이블 생성
        Base.metadata.create_all(bind=engine)
        print("✓ 테이블 생성 완료")
    except Exception as e:
        print(f"❌ 데이터베이스 연결 또는 테이블 생성 실패: {e}")
        print("서버는 계속 실행되지만 DB 기능이 제한됩니다.")
        return

    try:
        with SessionLocal() as s:
            # 부서/직급 시드
            dept_names = (
                "경영지원","인사","재무회계","법무","총무","영업","마케팅","제품기획",
                "개발(백엔드)","개발(프론트엔드)","데이터","인프라","품질(QA)","고객지원(CS)","디자인","운영",
            )
            rank_names = ("사원","주임","대리","과장","차장","부장","이사","상무","전무","부사장","사장","대표이사")

            exist = {n for (n,) in s.execute(select(Department.dept_name)).all()}
            for n in dept_names:
                if n not in exist:
                    s.add(Department(dept_name=n))
            exist = {n for (n,) in s.execute(select(JobRank.rank_name)).all()}
            for n in rank_names:
                if n not in exist:
                    s.add(JobRank(rank_name=n))
            s.commit()

            def dept_id(name: str) -> int | None:
                d = s.execute(select(Department).where(Department.dept_name == name)).scalar_one_or_none()
                return d.dept_id if d else None
            def rank_id(name: str) -> int | None:
                r = s.execute(select(JobRank).where(JobRank.rank_name == name)).scalar_one_or_none()
                return r.rank_id if r else None
            def ensure_member(_id: str, pwd: str, **kw):
                if s.execute(select(Member).where(Member.id == _id)).scalar_one_or_none() is None:
                    s.add(Member(
                        id=_id, password=hash_password(pwd), name=kw["name"], role=kw.get("role","user"),
                        birth=kw.get("birth"), dept_id=kw.get("dept_id"), rank_id=kw.get("rank_id"),
                        email=kw.get("email"), mobile=kw.get("mobile")
                    ))

            # 시드 데이터 생성 - 새 스키마의 시드 데이터와 일치
            ensure_member("admin", "admin", name="관리자", role="admin",
                          dept_id=dept_id("경영지원"), rank_id=rank_id("대표이사"))
            ensure_member("minha", "x", name="김민하", birth=date(1998, 12, 26), email="minha@example.com", mobile="010-0000-0001",
                          dept_id=dept_id("개발(백엔드)"), rank_id=rank_id("대리"))
            ensure_member("taewan", "x", name="김태완", birth=date(1997, 11, 2), email="taewan@example.com", mobile="010-0000-0002",
                          dept_id=dept_id("데이터"), rank_id=rank_id("과장"))
            ensure_member("sora", "x", name="안소라", birth=date(1995, 5, 21), email="sora@example.com", mobile="010-0000-0003",
                          dept_id=dept_id("인사"), rank_id=rank_id("차장"))
            ensure_member("cheolseong", "x", name="유철성", birth=date(1992, 8, 14), email="cheolseong@example.com", mobile="010-0000-0004",
                          dept_id=dept_id("개발(프론트엔드)"), rank_id=rank_id("주임"))
            ensure_member("jungmin", "x", name="안정민", birth=date(1999, 3, 10), email="jungmin@example.com", mobile="010-0000-0005",
                          dept_id=dept_id("제품기획"), rank_id=rank_id("사원"))
            s.commit()
            print("✓ 시드 데이터 생성 완료")
        
    except Exception as e:
        print(f"❌ 시드 데이터 생성 실패: {e}")
        print("기본 테이블은 생성되었지만 시드 데이터가 없을 수 있습니다.")

def get_db() -> Iterator:
    """데이터베이스 세션 의존성 (에러 처리 강화)"""
    try:
        db = SessionLocal()
        # 연결 테스트
        db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        print(f"❌ 데이터베이스 세션 생성 실패: {e}")
        raise
    finally:
        try:
            db.close()
        except:
            pass
