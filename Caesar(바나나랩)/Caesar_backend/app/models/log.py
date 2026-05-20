"""
Activity Log 모델
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class ActivityLog(Base):
    """활동 로그 모델"""

    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("member.user_id"), nullable=True)
    action = Column(String(100), nullable=False)  # 수행된 액션
    resource = Column(String(100), nullable=True)  # 대상 리소스
    details = Column(Text, nullable=True)  # 상세 정보 (JSON 형태)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 관계 설정
    user = relationship("Member", backref="activity_logs")

    def __repr__(self):
        return f"<ActivityLog(id={self.id}, action='{self.action}', user_id={self.user_id})>"

