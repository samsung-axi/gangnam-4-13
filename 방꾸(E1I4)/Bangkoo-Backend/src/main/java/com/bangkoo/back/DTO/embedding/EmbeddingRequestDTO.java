package com.bangkoo.back.dto.embedding;

import lombok.Data;

/**
 * 최초 작성자: 김병훈
 * 최초 작성일: 2025-04-17
 *
 */
@Data
public class EmbeddingRequestDTO {
    /**
     * 임베딩하는 AI서버 관련
     * 단일제품
     */
    private String name;
    private String description;
    private String detail;
    private String imageUrl;
    private String link;

}
