"""
Activity Logs API Router
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models.log import ActivityLog


router = APIRouter(prefix="/logs", tags=["logs"])


# Pydantic 스키마
class LogCreate(BaseModel):
    user_id: Optional[int] = None
    action: str
    resource: Optional[str] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class LogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource: Optional[str]
    details: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/", response_model=LogResponse, status_code=status.HTTP_201_CREATED)
async def create_log(log: LogCreate, db: Session = Depends(get_db)):
    """활동 로그 생성"""
    db_log = ActivityLog(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/", response_model=List[LogResponse])
async def list_logs(
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = Query(None, description="Filter by action"),
    user_id: Optional[int] = Query(None, description="Filter by user_id"),
    db: Session = Depends(get_db),
):
    """활동 로그 목록 조회"""
    query = db.query(ActivityLog)

    # 필터 적용
    if action:
        query = query.filter(ActivityLog.action.ilike(f"%{action}%"))
    if user_id:
        query = query.filter(ActivityLog.user_id == user_id)

    # 최신순 정렬
    logs = query.order_by(ActivityLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs


@router.get("/{log_id}", response_model=LogResponse)
async def get_log(log_id: int, db: Session = Depends(get_db)):
    """활동 로그 상세 조회"""
    log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Log not found"
        )
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_log(log_id: int, db: Session = Depends(get_db)):
    """활동 로그 삭제"""
    log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Log not found"
        )

    db.delete(log)
    db.commit()
    return None


@router.get("/users/{user_id}/logs", response_model=List[LogResponse])
async def get_user_logs(
    user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """특정 사용자의 활동 로그 조회"""
    logs = (
        db.query(ActivityLog)
        .filter(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return logs

