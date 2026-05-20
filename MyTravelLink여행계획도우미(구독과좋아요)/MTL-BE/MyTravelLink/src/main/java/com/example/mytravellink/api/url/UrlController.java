package com.example.mytravellink.api.url;

import com.example.mytravellink.api.url.dto.UrlRequest;
import com.example.mytravellink.api.url.dto.UrlResponse;
import com.example.mytravellink.api.url.dto.UserUrlRequest;
import com.example.mytravellink.domain.url.service.UrlService;
import com.example.mytravellink.auth.handler.JwtTokenProvider;
import com.example.mytravellink.domain.job.service.JobStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/url")
@Slf4j
public class UrlController {

    private final UrlService urlService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JobStatusService jobStatusService;

    public UrlController(UrlService urlService, JwtTokenProvider jwtTokenProvider, JobStatusService jobStatusService) {
        this.urlService = urlService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jobStatusService = jobStatusService;
    }

    @PostMapping("/analysis")
    public ResponseEntity<UrlResponse> processUrl(
            @RequestBody UrlRequest request) {
        // 여러 URL 중 첫 번째 URL를 기준으로 처리합니다.
        UrlResponse response = urlService.processUrl(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 매핑 API 엔드포인트
     * payload에 포함된 URL들을 기반으로 travel_info_url과 travel_info_place 매핑을 확인/생성하고,
     * 해당 TravelInfo의 id를 리턴합니다.
     */
    @PostMapping("/mapping")
    public ResponseEntity<Map<String, String>> mappingUrl(
            @RequestHeader("Authorization") String token,
            @RequestBody UrlRequest request) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        String travelInfoId = urlService.mappingUrl(request, email);
        Map<String, String> response = new HashMap<>();
        response.put("travelInfoId", travelInfoId);
        return ResponseEntity.ok(response);
    }

    /**
     * 유튜브 자막 체크 API (백엔드에서 FastAPI 자막 체크 엔드포인트 호출)
     */
    @PostMapping("/check_youtube_subtitles")
    public ResponseEntity<Map<String, Object>> checkYoutubeSubtitles(@RequestBody Map<String, String> requestBody) {
        String videoUrl = requestBody.get("video_url");
        boolean hasSubtitles = urlService.checkYoutubeSubtitles(videoUrl);
        Map<String, Object> response = new HashMap<>();
        response.put("video_url", videoUrl);
        response.put("has_subtitles", hasSubtitles);
        return ResponseEntity.ok(response);
    }

    // 비동기 분석 엔드포인트
    @PostMapping("/analysis/async")
    public ResponseEntity<String> processUrlAsync(@RequestBody UrlRequest request) {
        String jobId = UUID.randomUUID().toString();
        log.info("새로운 분석 작업 시작. JobID: {}", jobId);
        
        jobStatusService.setStatus(jobId, "Processing");
        
        // 비동기 작업 시작
        urlService.processUrlAsync(request, jobId);
        
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                           .body(jobId);
    }

    // 작업 상태 확인 엔드포인트
    @GetMapping("/analysis/status/{jobId}")
    public ResponseEntity<String> getJobStatus(@PathVariable String jobId) {
        String status = jobStatusService.getStatus(jobId);
        log.info("작업 상태 조회. JobID: {}, Status: {}", jobId, status);
        return ResponseEntity.ok(status);
    }
}