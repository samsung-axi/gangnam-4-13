package com.example.authapp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${app.file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.file.base-url:http://localhost:8080}")
    private String baseUrl;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("파일 저장 디렉토리 생성 완료: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("파일 저장 디렉토리를 생성할 수 없습니다.", ex);
        }
    }

    /**
     * 프로필 이미지 저장
     */
    public String storeProfileImage(MultipartFile file, Long userId) {
        // 파일명 생성
        String fileName = generateProfileImageFileName(file, userId);
        
        try {
            // 파일명 유효성 검사
            if (fileName.contains("..")) {
                throw new RuntimeException("파일명에 잘못된 경로가 포함되어 있습니다: " + fileName);
            }

            // 프로필 이미지 디렉토리 생성
            Path profileDir = this.fileStorageLocation.resolve("profiles");
            Files.createDirectories(profileDir);

            // 파일 저장
            Path targetLocation = profileDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("프로필 이미지 저장 완료: {}", targetLocation);

            // 접근 가능한 URL 반환
            return String.format("%s/api/files/profiles/%s", baseUrl, fileName);

        } catch (IOException ex) {
            throw new RuntimeException("파일 저장에 실패했습니다: " + fileName, ex);
        }
    }

    /**
     * 프로필 이미지 파일명 생성
     */
    private String generateProfileImageFileName(MultipartFile file, Long userId) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        // 고유한 파일명 생성: user_{userId}_{UUID}.{extension}
        return String.format("user_%d_%s%s", userId, UUID.randomUUID().toString(), fileExtension);
    }

    /**
     * 파일 유효성 검사
     */
    public void validateProfileImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("빈 파일은 업로드할 수 없습니다.");
        }

        // 파일 크기 검사 (5MB 제한)
        long maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("파일 크기는 5MB를 초과할 수 없습니다.");
        }

        // 파일 형식 검사
        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new RuntimeException("지원하지 않는 파일 형식입니다. (지원 형식: JPEG, PNG, GIF, WebP)");
        }
    }

    /**
     * 이미지 파일 형식 유효성 검사
     */
    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") ||
               contentType.equals("image/jpg") ||
               contentType.equals("image/png") ||
               contentType.equals("image/gif") ||
               contentType.equals("image/webp");
    }

    /**
     * 기존 프로필 이미지 삭제
     */
    public void deleteProfileImage(String imageUrl) {
        try {
            if (imageUrl != null && imageUrl.startsWith(baseUrl)) {
                String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                Path filePath = this.fileStorageLocation.resolve("profiles").resolve(fileName);
                Files.deleteIfExists(filePath);
                log.info("기존 프로필 이미지 삭제 완료: {}", filePath);
            }
        } catch (IOException ex) {
            log.warn("기존 프로필 이미지 삭제 실패: {}", imageUrl, ex);
        }
    }

    /**
     * 일반 파일 저장 (관리자용)
     */
    public String storeFile(MultipartFile file) {
        // 파일 유효성 검사
        validateProfileImage(file);
        
        // 파일명 생성
        String fileName = generateUniqueFileName(file);
        
        try {
            // 파일명 유효성 검사
            if (fileName.contains("..")) {
                throw new RuntimeException("파일명에 잘못된 경로가 포함되어 있습니다: " + fileName);
            }

            // 일반 파일 디렉토리 생성
            Path generalDir = this.fileStorageLocation.resolve("general");
            Files.createDirectories(generalDir);

            // 파일 저장
            Path targetLocation = generalDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("파일 저장 완료: {}", targetLocation);

            // 접근 가능한 URL 반환
            return String.format("%s/api/files/general/%s", baseUrl, fileName);

        } catch (IOException ex) {
            throw new RuntimeException("파일 저장에 실패했습니다: " + fileName, ex);
        }
    }

    /**
     * 일반 파일 삭제 (관리자용)
     */
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith(baseUrl)) {
                String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                
                // profiles 또는 general 디렉토리에서 파일 찾기
                Path profilePath = this.fileStorageLocation.resolve("profiles").resolve(fileName);
                Path generalPath = this.fileStorageLocation.resolve("general").resolve(fileName);
                
                boolean deleted = Files.deleteIfExists(profilePath) || Files.deleteIfExists(generalPath);
                
                if (deleted) {
                    log.info("파일 삭제 완료: {}", fileName);
                } else {
                    log.warn("삭제할 파일을 찾을 수 없습니다: {}", fileName);
                }
            }
        } catch (IOException ex) {
            log.warn("파일 삭제 실패: {}", fileUrl, ex);
            throw new RuntimeException("파일 삭제에 실패했습니다: " + fileUrl, ex);
        }
    }

    /**
     * 고유 파일명 생성
     */
    private String generateUniqueFileName(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        // 고유한 파일명 생성: {UUID}.{extension}
        return UUID.randomUUID().toString() + fileExtension;
    }
}
