package com.example.authapp.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${app.file.upload-dir:uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    /**
     * 프로필 이미지 제공
     */
    @GetMapping("/profiles/{fileName:.+}")
    public ResponseEntity<Resource> downloadProfileImage(@PathVariable String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve("profiles").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // 파일 타입 확인
                String contentType;
                try {
                    contentType = Files.probeContentType(filePath);
                } catch (IOException ex) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            log.error("파일 다운로드 오류: {}", fileName, ex);
            return ResponseEntity.badRequest().build();
        }
    }
}
