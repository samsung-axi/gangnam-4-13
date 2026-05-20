package com.pickfit.pickfit.multipartupload.controller;

import org.springframework.web.multipart.MultipartFile;
import com.pickfit.pickfit.multipartupload.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);
    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("email") String userEmail) {
        logger.info("파일 업로드 요청/ 파일이름: {}", file.getOriginalFilename());

        // 파일 업로드 서비스 호출
        String fileUrl = uploadService.uploadFile(userEmail,file);

        logger.info("파일업로드 성공 및 DB저장/ URL: {}", fileUrl);
        return ResponseEntity.ok(fileUrl);
    }
}
