-- ========================================
-- 불필요한 필드 제거 마이그레이션 스크립트
-- 실행 날짜: 2025-08-22
-- ========================================

-- 백업을 위한 테이블 생성 (선택사항)
CREATE TABLE users_backup_20250822 AS SELECT * FROM users;

-- 불필요한 필드들 제거
ALTER TABLE users 
    DROP COLUMN IF EXISTS allergies,
    DROP COLUMN IF EXISTS surgical_history;

-- 변경사항 확인
DESCRIBE users;

-- 백업 테이블 정리 (백업이 필요없다면 실행)
-- DROP TABLE users_backup_20250822;
