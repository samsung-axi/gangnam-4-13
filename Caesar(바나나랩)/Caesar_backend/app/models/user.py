"""
SQLAlchemy 모델 (IDE 타입힌트/보조용)
DB 자동생성/시드는 backend/database.py에서 처리.
"""
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, BigInteger, String, Date, TIMESTAMP, func, ForeignKey
from sqlalchemy import LargeBinary

Base = declarative_base()

class Department(Base):
    __tablename__ = "department"
    dept_id = Column(BigInteger, primary_key=True, autoincrement=True)
    dept_name = Column(String(100), unique=True, nullable=False)

class JobRank(Base):
    __tablename__ = "job_rank"
    rank_id = Column(BigInteger, primary_key=True, autoincrement=True)
    rank_name = Column(String(100), unique=True, nullable=False)

class Member(Base):
    __tablename__ = "member"
    user_id  = Column(BigInteger, primary_key=True, autoincrement=True)
    id       = Column(String(50), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    name     = Column(String(50), nullable=False)
    birth    = Column(Date)

    dept_id  = Column(BigInteger, ForeignKey("department.dept_id", onupdate="CASCADE", ondelete="SET NULL"))
    rank_id  = Column(BigInteger, ForeignKey("job_rank.rank_id",   onupdate="CASCADE", ondelete="SET NULL"))
    role     = Column(String(20), nullable=False, default="user")
    email    = Column(String(255))
    mobile   = Column(String(20))

    notion_api          = Column(LargeBinary)
    slack_api           = Column(LargeBinary)
    google_calendar_api = Column(LargeBinary)
    google_drive_api    = Column(LargeBinary)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
