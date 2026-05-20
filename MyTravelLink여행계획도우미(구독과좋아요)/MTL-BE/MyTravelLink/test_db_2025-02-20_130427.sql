-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: mytravellink.czaw4ussgprp.ap-northeast-2.rds.amazonaws.com    Database: test_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `guide_id` char(36) NOT NULL DEFAULT (uuid()),
  `course_number` int NOT NULL COMMENT '코스 순서',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_guide_course` (`guide_id`,`course_number`),
  CONSTRAINT `fk_course_guide` FOREIGN KEY (`guide_id`) REFERENCES `guide` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='코스 정보 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_place`
--

DROP TABLE IF EXISTS `course_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_place` (
  `place_id` char(36) NOT NULL COMMENT '장소 ID',
  `course_id` char(36) NOT NULL DEFAULT (uuid()),
  `place_num` int NOT NULL COMMENT '장소 순서',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`place_id`,`course_id`),
  KEY `fk_course_place_course` (`course_id`),
  CONSTRAINT `fk_course_place_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `fk_course_place_place` FOREIGN KEY (`place_id`) REFERENCES `place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='코스-장소 연결 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guide`
--

DROP TABLE IF EXISTS `guide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guide` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `travel_info_id` varchar(36) NOT NULL COMMENT '여행 정보 ID',
  `course_count` int unsigned DEFAULT '0' COMMENT '코스 수',
  `title` varchar(100) NOT NULL COMMENT '가이드 제목',
  `travel_days` int DEFAULT NULL COMMENT '여행 일수',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  `is_favorite` tinyint(1) NOT NULL DEFAULT '0' COMMENT '즐겨찾기 여부',
  `fixed` tinyint(1) NOT NULL DEFAULT '0' COMMENT '고정 여부',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
  `use_count` int NOT NULL DEFAULT '0',
  `plan_types` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_guide_travel_info` (`travel_info_id`),
  KEY `idx_guide_bookmark` (`is_favorite`),
  CONSTRAINT `fk_guide_travel_info` FOREIGN KEY (`travel_info_id`) REFERENCES `travel_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 가이드 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `place`
--

DROP TABLE IF EXISTS `place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place` (
  `id` char(36) NOT NULL,
  `address` varchar(500) NOT NULL COMMENT '주소',
  `title` varchar(255) NOT NULL,
  `description` text COMMENT '설명',
  `intro` text,
  `type` varchar(50) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL COMMENT '이미지 URL',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  `open_hours` text,
  `phone` varchar(255) DEFAULT NULL,
  `rating` decimal(38,2) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_place_location` (`latitude`,`longitude`),
  KEY `idx_place_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='장소 정보 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `travel_info`
--

DROP TABLE IF EXISTS `travel_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_info` (
  `id` varchar(36) NOT NULL COMMENT '여행 정보 ID (UUID)',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일',
  `url_id` varchar(128) DEFAULT NULL,
  `place_count` int unsigned DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT NULL,
  `fixed` tinyint(1) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT NULL,
  `travel_days` int DEFAULT NULL COMMENT '여행 기간 (일)',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  `use_count` int NOT NULL,
  `ext_place_list_id` varchar(36) NOT NULL,
  `travel_taste_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_travel_info_user` (`email`),
  KEY `fk_travel_info_url` (`url_id`),
  KEY `idx_travel_info_bookmark` (`is_favorite`),
  CONSTRAINT `fk_travel_info_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_travel_info_user` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 정보 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `travel_info_place`
--

DROP TABLE IF EXISTS `travel_info_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_info_place` (
  `travel_info_id` varchar(36) NOT NULL COMMENT '여행 정보 ID',
  `place_id` char(36) NOT NULL COMMENT '장소 ID',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '삭제 여부',
  PRIMARY KEY (`travel_info_id`,`place_id`),
  KEY `fk_tip_place` (`place_id`),
  CONSTRAINT `fk_tip_place` FOREIGN KEY (`place_id`) REFERENCES `place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tip_travel_info` FOREIGN KEY (`travel_info_id`) REFERENCES `travel_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 정보-장소 연결 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `travel_info_url`
--

DROP TABLE IF EXISTS `travel_info_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_info_url` (
  `travel_info_id` varchar(36) NOT NULL COMMENT '여행 정보 ID',
  `url_id` varchar(128) NOT NULL COMMENT 'URL ID',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`travel_info_id`,`url_id`),
  KEY `fk_tiu_url` (`url_id`),
  CONSTRAINT `fk_tiu_travel_info` FOREIGN KEY (`travel_info_id`) REFERENCES `travel_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tiu_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='여행 정보-URL 연결 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `url`
--

DROP TABLE IF EXISTS `url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `url` (
  `id` varchar(128) NOT NULL COMMENT 'URL ID (SHA-512 해시)',
  `url_title` varchar(500) NOT NULL COMMENT 'URL 제목',
  `url_author` varchar(255) DEFAULT NULL COMMENT 'URL 작성자',
  `url` varchar(1000) NOT NULL COMMENT 'URL 주소',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='URL 정보 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `url_place`
--

DROP TABLE IF EXISTS `url_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `url_place` (
  `url_id` varchar(128) NOT NULL COMMENT 'URL ID',
  `place_id` char(36) NOT NULL COMMENT '장소 ID',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`url_id`,`place_id`),
  KEY `fk_url_place_place` (`place_id`),
  CONSTRAINT `fk_url_place_place` FOREIGN KEY (`place_id`) REFERENCES `place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_url_place_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='URL-장소 연결 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_search_term`
--

DROP TABLE IF EXISTS `user_search_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_search_term` (
  `id` varchar(36) NOT NULL COMMENT '검색어 ID (UUID)',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일',
  `word` varchar(100) NOT NULL COMMENT '검색어',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`id`),
  KEY `fk_search_term_user` (`email`),
  CONSTRAINT `fk_search_term_user` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자 검색어 기록 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_url`
--

DROP TABLE IF EXISTS `user_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_url` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일',
  `url_id` varchar(128) NOT NULL COMMENT 'URL ID',
  `is_use` tinyint(1) NOT NULL DEFAULT '1' COMMENT '사용 여부',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`email`,`url_id`),
  KEY `fk_user_url_url` (`url_id`),
  CONSTRAINT `fk_user_url_url` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_url_user` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자-URL 연결 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사용자 이메일 (주 식별자)',
  `name` varchar(50) NOT NULL COMMENT '사용자 이름',
  `profile_img` varchar(500) DEFAULT NULL COMMENT '프로필 이미지 URL',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '삭제 여부',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `update_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자 정보 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'test_db'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20 13:04:38
