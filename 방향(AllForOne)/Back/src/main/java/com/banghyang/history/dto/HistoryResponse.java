package com.banghyang.history.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class HistoryResponse {
    private Long id;
    private String chatId;
    private Long memberId;
    private Long lineId;
    private List<RecommendationDto> recommendations;
    private LocalDateTime timeStamp;

    @Data
    public static class RecommendationDto {
        private String productNameKr;
        private String productBrand;
        private String productGrade;
        private List<String> productImageUrls;
        private String reason;
        private String situation;
    }
}
