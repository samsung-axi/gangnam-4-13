package com.example.mytravellink.domain.job.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;
import org.springframework.scheduling.annotation.Scheduled;

@Slf4j
@Service
public class JobStatusService {
    private final Map<String, JobStatus> jobs = new ConcurrentHashMap<>();

    @Getter
    @AllArgsConstructor
    public static class JobStatus {
        private String status;    // PENDING, PROCESSING, COMPLETED, FAILED
        private String result;
        private String error;     // 에러 메시지 필드 추가
        private LocalDateTime createdAt;  // 작업 시작 시간 추가
        private LocalDateTime updatedAt;  // 마지막 업데이트 시간 추가
    }

    /**
     * 작업 상태 설정
     * @param jobId 작업 ID
     * @param status 상태
     */
    public void setStatus(String jobId, String status) {
        log.info("Setting job status. JobID: {}, Status: {}", jobId, status);
        jobs.put(jobId, new JobStatus(status, null, null, LocalDateTime.now(), LocalDateTime.now()));
    }

    /**
     * 작업 결과 설정
     * @param jobId 작업 ID
     * @param result 결과
     */
    public void setResult(String jobId, String result) {
        JobStatus current = jobs.get(jobId);
        String currentStatus = (current != null) ? current.getStatus() : null;
        String currentError = (current != null) ? current.getError() : null;
        LocalDateTime createdAt = (current != null) ? current.getCreatedAt() : LocalDateTime.now();
        jobs.put(jobId, new JobStatus(currentStatus, result, currentError, createdAt, LocalDateTime.now()));
    }

    /**
     * 작업 상태 조회
     * @param jobId 작업 ID
     * @return 상태
     */
    public String getStatus(String jobId) {
        JobStatus jobStatus = jobs.get(jobId);
        log.debug("Getting job status. JobID: {}, Status: {}", jobId, jobStatus);
        return jobStatus != null ? jobStatus.getStatus() : "Not Found";
    }

    /**
     * 작업 결과 조회
     * @param jobId 작업 ID
     * @return 결과
     */
    public String getResult(String jobId) {
        JobStatus jobStatus = jobs.get(jobId);
        log.debug("Getting job result. JobID: {}, Result: {}", jobId, jobStatus);
        return jobStatus != null ? jobStatus.getResult() : null;
    }

    /**
     * 작업 정보 삭제
     * @param jobId 작업 ID
     */
    public void removeJob(String jobId) {
        log.info("Removing job. JobID: {}", jobId);
        jobs.remove(jobId);
    }

    /**
     * 작업 상태와 에러 메시지 설정
     * @param jobId 작업 ID
     * @param status 상태
     * @param result 결과
     * @param error 에러 메시지
     */
    public void setJobStatus(String jobId, String status, String result, String error) {
        log.info("Job Status Update - ID: {}, Status: {}, Error: {}", jobId, status, error);
        jobs.put(jobId, new JobStatus(
            status, 
            result,
            error,
            jobs.containsKey(jobId) ? jobs.get(jobId).getCreatedAt() : LocalDateTime.now(),
            LocalDateTime.now()
        ));
    }

    /**
     * 에러 메시지 설정
     * @param jobId 작업 ID
     * @param error 에러 메시지
     */
    public void setError(String jobId, String error) {
        JobStatus current = jobs.get(jobId);
        if (current != null) {
            jobs.put(jobId, new JobStatus(
                current.getStatus(),
                current.getResult(),
                error,
                current.getCreatedAt(),
                LocalDateTime.now()
            ));
        }
    }

    /**
     * 에러 메시지 조회
     * @param jobId 작업 ID
     * @return 에러 메시지
     */
    public String getError(String jobId) {
        JobStatus jobStatus = jobs.get(jobId);
        return jobStatus != null ? jobStatus.getError() : null;
    }

    public JobStatus getJobStatus(String jobId) {
        return jobs.getOrDefault(jobId, 
            new JobStatus("NOT_FOUND", null, null, null, null));
    }

    // 오래된 작업 정리
    @Scheduled(fixedRate = 3600000) // 1시간마다 실행
    public void cleanupOldJobs() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        jobs.entrySet().removeIf(entry -> 
            entry.getValue().getUpdatedAt().isBefore(threshold));
    }
} 