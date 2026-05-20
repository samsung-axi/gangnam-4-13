package com.bangkoo.back.controller.detection;

import com.bangkoo.back.dto.detection.DetectionResponseDTO;
import com.bangkoo.back.service.detection.DetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 최초 작성자 : 김범석
 * 최초 작성일 : 2025-04-09
 *
 * Object Detection 설정 클래스
 * - FrontEnd 및 FastAPI 연결 다리 역할
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class DetectionController {

    private final DetectionService detectionService;

    @PostMapping("/detect_all_base64")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file,@RequestParam("canvasWidth") int canvasWidth, @RequestParam("canvasHeight") int canvasHeight) throws IOException {
        System.out.println("📐 canvas size: " + canvasWidth + "x" + canvasHeight);
        // 파일을 바이트 배열로 읽기
        byte[] imageBytes = file.getBytes();
        // 감지 처리 결과
        DetectionResponseDTO result = detectionService.upload(imageBytes,canvasWidth, canvasHeight);

        // 결과 응답 포맷 예시
        Map<String, Object> response = new HashMap<>();
        response.put("results", result.getResults());
        response.put("final_image_base64", result.getFinal_image_base64());
        response.put("thumbnails_base64", result.getThumbnails_base64());
        response.put("original_image_base64", result.getOriginal_image_base64());


        return ResponseEntity.ok(response);
    }

//    @PostMapping("/detect_all")
//    public ResponseEntity<?> detectAll() {
//        return ResponseEntity.ok(detectionService.detectAll());
//    }
}