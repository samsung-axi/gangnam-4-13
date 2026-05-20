package com.bangkoo.back.dto.placement;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 최초 작성자 : 김태원
 * 최초 작성일 : 2025-04-11
 *
 * 📦 PlacementResultResponse
 * - 사용자가 저장한 인테리어 결과 정보를 반환하는 DTO
 * - 프론트에서 불러올 때 imageUrl, 설명, 생성일시, 작성자(userId) 정보 포함
 */
@Data
@Builder
public class PlacementResultResponse {

    /** 결과 이미지의 S3 URL */
    private String imageUrl;

    /** 작성한 인테리어 설명 */
    private String explanation;

    /** 작성 시간 */
    private LocalDateTime createdAt;

    /** 작성자 ID */
    private String userId;

}
