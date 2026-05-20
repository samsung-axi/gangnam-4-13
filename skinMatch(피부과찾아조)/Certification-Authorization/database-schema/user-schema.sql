-- ========================================
-- 사용자 관리 시스템 데이터베이스 스키마
-- 업데이트: 2025-08-20 (분석 통계 및 접속 상태 관리 추가)
-- ========================================

-- 1. 사용자 기본 정보 테이블 (업데이트)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 ID',
    
    -- 기본 인증 정보
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '이메일 (로그인 ID)',
    username VARCHAR(255) UNIQUE COMMENT '사용자명 (표시용 ID)',
    password VARCHAR(255) COMMENT '암호화된 비밀번호 (OAuth 사용자는 NULL 가능)',
    name VARCHAR(255) NOT NULL COMMENT '사용자 이름',
    nickname VARCHAR(255) COMMENT '닉네임',
    
    -- 프로필 정보
    profile_image VARCHAR(255) COMMENT '프로필 이미지 URL',
    
    -- 개인 정보
    gender VARCHAR(50) COMMENT '성별',
    birth_year VARCHAR(4) COMMENT '출생년도',
    nationality VARCHAR(100) COMMENT '국적',
    address VARCHAR(500) COMMENT '주소',
    
    -- OAuth 관련
    provider ENUM('GOOGLE', 'NAVER') COMMENT 'OAuth 제공자',
    provider_id VARCHAR(255) COMMENT '제공자별 고유 ID',
    
    -- 계정 상태
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER' COMMENT '사용자 권한',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '계정 활성 상태',
    
    -- 접속 상태 관리
    last_login_at TIMESTAMP NULL COMMENT '마지막 로그인 시간',
    is_online BOOLEAN NOT NULL DEFAULT FALSE COMMENT '현재 온라인 상태',
    
    -- 분석 관련 정보
    analysis_count INT NOT NULL DEFAULT 0 COMMENT '총 분석 횟수',
    last_analysis_at TIMESTAMP NULL COMMENT '마지막 분석 시간',
    
    -- 시간 정보
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정일',
    
    -- 인덱스
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_provider (provider, provider_id),
    INDEX idx_active (active),
    INDEX idx_online (is_online),
    INDEX idx_last_login (last_login_at),
    INDEX idx_analysis_count (analysis_count),
    INDEX idx_last_analysis (last_analysis_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자 기본 정보';

-- 2. 리프레시 토큰 테이블
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    token VARCHAR(255) NOT NULL UNIQUE COMMENT '리프레시 토큰',
    expiry_date TIMESTAMP NOT NULL COMMENT '만료일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='리프레시 토큰';

-- 3. 파일 업로드 정보 테이블
CREATE TABLE uploaded_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT COMMENT '업로드한 사용자 ID (NULL 가능)',
    original_filename VARCHAR(255) NOT NULL COMMENT '원본 파일명',
    stored_filename VARCHAR(255) NOT NULL COMMENT '저장된 파일명',
    file_path VARCHAR(500) NOT NULL COMMENT '파일 경로',
    file_size BIGINT NOT NULL COMMENT '파일 크기 (bytes)',
    content_type VARCHAR(100) COMMENT '파일 MIME 타입',
    file_type ENUM('PROFILE_IMAGE', 'ANALYSIS_IMAGE', 'GENERAL') NOT NULL DEFAULT 'GENERAL' COMMENT '파일 유형',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_file_type (file_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='업로드된 파일 정보';

-- 4. 향후 AI 피부 분석 결과 테이블 (예시)
CREATE TABLE skin_analysis_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '분석을 받은 사용자 ID',
    analysis_type ENUM('CAMERA', 'SURVEY', 'AI_ANALYSIS') NOT NULL COMMENT '분석 유형',
    image_file_id BIGINT COMMENT '분석에 사용된 이미지 파일 ID',
    
    -- 분석 결과 (JSON 형태로 저장 가능)
    result_data JSON COMMENT '분석 결과 데이터',
    confidence_score DECIMAL(5,4) COMMENT '신뢰도 점수 (0.0000 ~ 1.0000)',
    
    -- 분석 메타데이터
    analysis_duration_ms INT COMMENT '분석 소요 시간 (밀리초)',
    model_version VARCHAR(50) COMMENT '사용된 AI 모델 버전',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (image_file_id) REFERENCES uploaded_files(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_analysis_type (analysis_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 피부 분석 결과';

-- 5. 관리자 통계를 위한 뷰 생성
CREATE VIEW admin_stats_view AS
SELECT 
    -- 총 사용자 수
    (SELECT COUNT(*) FROM users) as total_users,
    
    -- 현재 온라인 사용자 수
    (SELECT COUNT(*) FROM users WHERE is_online = TRUE) as online_users,
    
    -- 최근 5분 이내 활동한 사용자 수
    (SELECT COUNT(*) FROM users WHERE last_login_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)) as recently_active_users,
    
    -- 활성 계정 수 (계정 상태)
    (SELECT COUNT(*) FROM users WHERE active = TRUE) as active_accounts,
    
    -- 비활성 계정 수 (계정 상태)
    (SELECT COUNT(*) FROM users WHERE active = FALSE) as inactive_accounts,
    
    -- 오늘 가입한 사용자 수
    (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()) as new_users_today,
    
    -- 이번 주 가입한 사용자 수
    (SELECT COUNT(*) FROM users WHERE YEARWEEK(created_at) = YEARWEEK(NOW())) as new_users_this_week,
    
    -- 총 분석 수 (향후 구현)
    (SELECT COUNT(*) FROM skin_analysis_results) as total_analyses,
    
    -- 오늘 분석 수 (향후 구현)
    (SELECT COUNT(*) FROM skin_analysis_results WHERE DATE(created_at) = CURDATE()) as analyses_today,
    
    -- OAuth 사용자 통계
    (SELECT COUNT(*) FROM users WHERE provider = 'GOOGLE') as google_users,
    (SELECT COUNT(*) FROM users WHERE provider = 'NAVER') as naver_users,
    (SELECT COUNT(*) FROM users WHERE provider IS NULL) as regular_users;

-- 6. 온라인 상태 관리를 위한 프로시저
DELIMITER //

-- 사용자 로그인 시 호출
CREATE PROCEDURE UpdateUserLoginStatus(IN user_id BIGINT)
BEGIN
    UPDATE users 
    SET 
        last_login_at = NOW(),
        is_online = TRUE
    WHERE id = user_id;
END //

-- 사용자 로그아웃 시 호출
CREATE PROCEDURE UpdateUserLogoutStatus(IN user_id BIGINT)
BEGIN
    UPDATE users 
    SET is_online = FALSE
    WHERE id = user_id;
END //

-- 분석 완료 시 호출
CREATE PROCEDURE UpdateUserAnalysisStats(IN user_id BIGINT)
BEGIN
    UPDATE users 
    SET 
        analysis_count = analysis_count + 1,
        last_analysis_at = NOW()
    WHERE id = user_id;
END //

-- 비활성 사용자 정리 (5분 이상 미활동 시 오프라인으로 설정)
CREATE PROCEDURE CleanupInactiveUsers()
BEGIN
    UPDATE users 
    SET is_online = FALSE
    WHERE is_online = TRUE 
    AND last_login_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE);
END //

DELIMITER ;

-- 7. 데이터베이스 마이그레이션 스크립트 (기존 테이블이 있는 경우)
-- ALTER TABLE users 
-- ADD COLUMN analysis_count INT NOT NULL DEFAULT 0 COMMENT '총 분석 횟수',
-- ADD COLUMN last_analysis_at TIMESTAMP NULL COMMENT '마지막 분석 시간',
-- ADD INDEX idx_analysis_count (analysis_count),
-- ADD INDEX idx_last_analysis (last_analysis_at);

-- 8. 샘플 데이터 삽입 (테스트용)
INSERT INTO users (email, username, name, role, active, is_online, last_login_at, analysis_count) VALUES
('admin@skincarestory.com', 'admin', 'System Administrator', 'ADMIN', TRUE, FALSE, NOW(), 0),
('test@example.com', 'testuser', '테스트 사용자', 'USER', TRUE, TRUE, NOW(), 5),
('inactive@example.com', 'inactive', '비활성 사용자', 'USER', FALSE, FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY), 2);

-- 테이블 정보 확인
SHOW TABLES;
DESCRIBE users;
SHOW INDEX FROM users;
