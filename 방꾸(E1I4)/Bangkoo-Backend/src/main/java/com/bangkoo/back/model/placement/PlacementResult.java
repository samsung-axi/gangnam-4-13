package com.bangkoo.back.model.placement;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * 최초 작성자 : 김태원
 * 최초 작성일 : 2025-04-11
 *
 * 🎨 PlacementResult (가구 배치 결과)
 * - 사용자가 수행한 배치 작업 결과를 저장하는 도큐먼트
 * - S3에 업로드된 결과 이미지의 URL을 함께 저장
 */
@Document(collection = "placement_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementResult {

    /** MongoDB 내부 고유 식별자 */
    @Id
    private String id;

    /** 결과를 생성한 사용자 ID (users 컬렉션의 _id 참조) */
    private String userId;

    /** 결과 이미지의 S3 URL */
    private String imageUrl;

    /** 결과 이미지에 대한 설명 */
    private String explanation;

    /** 결과 생성 시각 */
    private LocalDateTime createdAt;
}
