-- 데이터베이스 생성
DROP DATABASE IF EXISTS travel_db;
CREATE DATABASE travel_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE travel_db;

-- 1단계: 독립적인 기본 테이블들
CREATE TABLE `users` (
    `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일 (주 식별자)',
    `name` varchar(50) NOT NULL COMMENT '사용자 이름',
    `profile_img` varchar(500) DEFAULT NULL COMMENT '프로필 이미지 URL',
    `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자 정보 테이블';

CREATE TABLE `url` (
    `id` varchar(128) NOT NULL COMMENT 'URL ID (SHA-512 해시)',
    `url_title` varchar(500) NOT NULL COMMENT 'URL 제목',
    `url_author` varchar(255) DEFAULT NULL COMMENT 'URL 작성자',
    `url` varchar(1000) NOT NULL COMMENT 'URL 주소',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='URL 정보 테이블';

CREATE TABLE `place` (
    `id` varchar(36) NOT NULL COMMENT '장소 ID (UUID)',
    `address` varchar(500) NOT NULL COMMENT '주소',
    `title` varchar(255) NOT NULL COMMENT '장소명',
    `description` text COMMENT '설명',
    `intro` varchar(200) DEFAULT NULL COMMENT '요약',
    `type` varchar(50) NOT NULL COMMENT '장소 유형',
    `image` varchar(500) DEFAULT NULL COMMENT '이미지 URL',
    `latitude` decimal(10,8) DEFAULT NULL,
    `longitude` decimal(11,8) DEFAULT NULL,
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    `open_hours` varchar(255) NOT NULL COMMENT '운영 시간',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='장소 정보 테이블';

-- 2단계: 기본 테이블을 참조하는 테이블들
CREATE TABLE `travel_info` (
    `id` varchar(36) NOT NULL COMMENT '여행 정보 ID (UUID)',
    `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일',
    `url_id` varchar(128) NOT NULL COMMENT '관련 URL ID',
    `place_count` int unsigned DEFAULT '0' COMMENT '장소 수',
    `title` varchar(100) NOT NULL COMMENT '여행 제목',
    `is_favorite` tinyint(1) NOT NULL DEFAULT '0' COMMENT '북마크 여부',
    `fixed` tinyint(1) NOT NULL DEFAULT '0' COMMENT '고정 여부',
    `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
    `travel_days` int DEFAULT NULL COMMENT '여행 기간 (일)',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_travel_info_user` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_travel_info_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 정보 테이블';

CREATE TABLE `user_search_term` (
    `id` varchar(36) NOT NULL COMMENT '검색어 ID (UUID)',
    `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일',
    `word` varchar(100) NOT NULL COMMENT '검색어',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_search_term_user` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자 검색어 기록 테이블';

CREATE TABLE `user_url` (
    `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일',
    `url_id` varchar(128) NOT NULL COMMENT 'URL ID',
    `is_use` tinyint(1) NOT NULL DEFAULT '1' COMMENT '사용 여부',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`email`,`url_id`),
    CONSTRAINT `fk_user_url_user` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_user_url_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자-URL 연결 테이블';

CREATE TABLE `url_place` (
    `url_id` varchar(128) NOT NULL COMMENT 'URL ID',
    `place_id` varchar(36) NOT NULL COMMENT '장소 ID',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`url_id`,`place_id`),
    CONSTRAINT `fk_url_place_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_url_place_place` FOREIGN KEY (`place_id`) REFERENCES `place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='URL-장소 연결 테이블';

-- 3단계: 1차 참조 테이블을 참조하는 테이블들
CREATE TABLE `guide` (
    `id` varchar(36) NOT NULL COMMENT '가이드 ID',
    `travel_info_id` varchar(36) NOT NULL COMMENT '여행 정보 ID',
    `course_count` int unsigned DEFAULT '0' COMMENT '코스 수',
    `title` varchar(100) NOT NULL COMMENT '가이드 제목',
    `travel_days` int DEFAULT NULL COMMENT '여행 일수',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    `is_favorite` tinyint(1) NOT NULL DEFAULT '0' COMMENT '북마크 여부',
    `fixed` tinyint(1) NOT NULL DEFAULT '0' COMMENT '고정 여부',
    `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_guide_travel_info` FOREIGN KEY (`travel_info_id`) REFERENCES `travel_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 가이드 테이블';

CREATE TABLE `travel_info_place` (
    `travel_info_id` varchar(36) NOT NULL COMMENT '여행 정보 ID',
    `place_id` varchar(36) NOT NULL COMMENT '장소 ID',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`travel_info_id`,`place_id`),
    CONSTRAINT `fk_tip_travel_info` FOREIGN KEY (`travel_info_id`) REFERENCES `travel_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_tip_place` FOREIGN KEY (`place_id`) REFERENCES `place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 정보-장소 연결 테이블';

CREATE TABLE `travel_info_url` (
    `travel_info_id` varchar(36) NOT NULL COMMENT '여행 정보 ID',
    `url_id` varchar(128) NOT NULL COMMENT 'URL ID',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`travel_info_id`,`url_id`),
    CONSTRAINT `fk_tiu_travel_info` FOREIGN KEY (`travel_info_id`) REFERENCES `travel_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_tiu_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 정보-URL 연결 테이블';

-- 4단계: 2차 참조 테이블을 참조하는 테이블들
CREATE TABLE `course` (
    `id` varchar(36) NOT NULL COMMENT '코스 ID',
    `guide_id` varchar(36) NOT NULL COMMENT '가이드 ID',
    `course_number` int NOT NULL COMMENT '코스 순서',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_guide_course` (`guide_id`,`course_number`),
    CONSTRAINT `fk_course_guide` FOREIGN KEY (`guide_id`) REFERENCES `guide` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='코스 정보 테이블';

-- 5단계: 3차 참조 테이블을 참조하는 테이블들
CREATE TABLE `course_place` (
    `place_id` varchar(36) NOT NULL COMMENT '장소 ID',
    `course_id` varchar(36) NOT NULL COMMENT '코스 ID',
    `place_num` int NOT NULL COMMENT '장소 순서',
    `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
    PRIMARY KEY (`place_id`,`course_id`),
    CONSTRAINT `fk_course_place_place` FOREIGN KEY (`place_id`) REFERENCES `place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_course_place_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='코스-장소 연결 테이블';

-- 인덱스 생성
CREATE INDEX idx_place_location ON place(latitude, longitude);
CREATE INDEX idx_travel_info_is_favorite ON travel_info(is_favorite);
CREATE INDEX idx_guide_is_favorite ON guide(is_favorite);
CREATE INDEX idx_place_title ON place(title);

ALTER TABLE place MODIFY open_hours TEXT NULL;
ALTER TABLE place MODIFY intro TEXT;