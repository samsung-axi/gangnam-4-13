package com.banghyang.chat.dto;

import com.banghyang.common.type.ChatMode;
import lombok.Data;

import java.util.List;

@Data
public class ProductRecommendationResponse {
    private String status;
    private ChatMode mode;
    private Long line_id;
    private String content;
    private Long recommendation_type; // 1: 일반추천, 2: 패션, 3: 인테리어, 4: 테라피, 0: 일반대화
    private String image_path;
    private List<Recommendation> recommendations;

    @Data
    public static class Recommendation {
        private Long id;
        private String name;
        private String brand;
        private String reason;
        private String situation;
    }
}
