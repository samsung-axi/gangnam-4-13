package com.bangkoo.back.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductsRequestDTO {
    /**
     * 프론트에서 요청 받을 필드 정의
     */

    private String id;             // 제품 id
    private String name;           // 제품명
    private String description;    // 간단 설명
    private String detail;         //상세 설명
    private String price;          // 가격 (₩단위 포함 또는 int)
    private String link;           // IKEA 상세 링크
    private String imageUrl;       // 대표 이미지 URL
    private String model3dUrl;     // 3D 이미지 URL(태원)
    private String csv;
}
