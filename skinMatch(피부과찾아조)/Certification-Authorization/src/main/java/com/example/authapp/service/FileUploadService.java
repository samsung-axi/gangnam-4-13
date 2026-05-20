package com.example.authapp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class FileUploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * 프로필 이미지 업로드
     */
    public String uploadProfileImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("업로드할 파일이 없습니다.");
        }

        // 파일 타입 검증
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("이미지 파일만 업로드 가능합니다.");
        }

        // 파일 크기 검증 (5MB 제한)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("파일 크기는 5MB 이하여야 합니다.");
        }

        // 업로드 디렉토리 생성
        Path uploadPath = Paths.get(uploadDir, "profiles");
        log.info("=== 파일 업로드 디렉토리 확인 ===");
        log.info("Upload dir: {}", uploadDir);
        log.info("Upload path: {}", uploadPath.toAbsolutePath());
        log.info("Directory exists: {}", Files.exists(uploadPath));
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("Directory created: {}", uploadPath.toAbsolutePath());
        }

        // 파일명 생성 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;

        // 파일 저장
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 파일 저장 확인
        log.info("=== 파일 저장 완료 ===");
        log.info("File path: {}", filePath.toAbsolutePath());
        log.info("File exists: {}", Files.exists(filePath));
        log.info("File size: {} bytes", Files.size(filePath));

        // 접근 가능한 URL 반환
        String fileUrl = baseUrl + "/uploads/profiles/" + filename;
        log.info("Generated URL: {}", fileUrl);
        
        return fileUrl;
    }

    /**
     * 외부 URL에서 이미지 다운로드 후 로컬에 저장
     */
    public String downloadAndSaveImage(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return null;
        }

        try {
            log.info("=== 외부 이미지 다운로드 시작 ===");
            log.info("Source URL: {}", imageUrl);

            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir, "profiles");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Directory created: {}", uploadPath.toAbsolutePath());
            }

            // URL에서 이미지 다운로드
            URL url = new URL(imageUrl);
            URLConnection connection = url.openConnection();
            
            // User-Agent 설정으로 차단 방지
            connection.setRequestProperty("User-Agent", 
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            connection.setConnectTimeout(10000); // 10초
            connection.setReadTimeout(10000);    // 10초

            // 파일 확장자 추출
            String contentType = connection.getContentType();
            String extension = ".jpg"; // 기본값
            if (contentType != null) {
                if (contentType.contains("png")) extension = ".png";
                else if (contentType.contains("gif")) extension = ".gif";
                else if (contentType.contains("webp")) extension = ".webp";
            }

            // 파일명 생성
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // 파일 다운로드 및 저장
            try (InputStream inputStream = connection.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // 저장 확인
            if (Files.exists(filePath) && Files.size(filePath) > 0) {
                String localUrl = baseUrl + "/uploads/profiles/" + filename;
                log.info("=== 이미지 다운로드 완료 ===");
                log.info("Local file: {}", filePath.toAbsolutePath());
                log.info("File size: {} bytes", Files.size(filePath));
                log.info("Local URL: {}", localUrl);
                return localUrl;
            } else {
                log.error("이미지 다운로드 실패: 파일이 생성되지 않음");
                return null;
            }

        } catch (Exception e) {
            log.error("외부 이미지 다운로드 실패: {}", imageUrl, e);
            return null;
        }
    }

    /**
     * 파일 삭제
     */
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith(baseUrl)) {
                String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                Path filePath = Paths.get(uploadDir, "profiles", filename);
                
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    log.info("File deleted successfully: {}", fileUrl);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to delete file: {}", fileUrl, e);
        }
    }
}
