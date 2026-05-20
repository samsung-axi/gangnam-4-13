package com.banghyang.chat.entity;

import com.banghyang.common.type.ChatMode;
import com.banghyang.common.type.ChatType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "chat")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chat {
    @Id
    private String id; // MongoDB 에서 자동 생성되는 ID

    @Field("type")
    private ChatType type; // 메시지 타입 (USER, AI)

    @Field("mode")
    private ChatMode mode; // ai 채팅 답변 모드(chat, recommend)

    @Field("member_id")
    private Long memberId; // 회원 ID

    @Field("content")
    private String content; // 회원 채팅 텍스트 입력값

    @Field("recommendations")
    private List<Recommendation> recommendations; // 향수 추천 내용

    @Field("line_id")
    private Long lineId; // 향수 추천 기준 계열 아이디

    @Field("recommendation_type")
    private Long recommendationType; // 향수 추천 타입 (1: 일반추천, 2: 패션, 3: 인테리어, 4: 테라피, 0: 일반대화)

    @Field("image_url")
    private String imageUrl; // 회원 채팅 이미지 입력값

    @Field("timeStamp")
    @CreatedDate
    private LocalDateTime timeStamp; // 메시지 생성 시간

    @Data
    public static class Recommendation {
        @Field("product_name_kr")
        private String productNameKr;
        @Field("product_image_url")
        private List<String> productImageUrls;
        @Field("product_brand")
        private String productBrand;
        @Field("product_grade")
        private String productGrade;
        @Field("reason")
        private String reason;
        @Field("situation")
        private String situation;
    }

    @Builder
    public Chat(
            ChatType type,
            Long memberId,
            String content,
            String imageUrl,
            ChatMode mode,
            Long lineId,
            Long recommendationType,
            List<Recommendation> recommendations
    ) {
        this.type = type;
        this.memberId = memberId;
        this.content = content;
        this.recommendationType = recommendationType;
        this.imageUrl = imageUrl;
        this.mode = mode;
        this.lineId = lineId;
        this.recommendations = recommendations;
    }
}
