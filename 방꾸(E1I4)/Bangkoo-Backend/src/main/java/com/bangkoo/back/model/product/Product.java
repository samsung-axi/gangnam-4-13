package com.bangkoo.back.model.product;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 최초 작성자 : 김동규
 * 최초 작성일 : 2025-04-01
 *
 * 제품(Product) 도메인 모델 클래스
 * - MongoDB "products" 컬렉션에 저장됨
 * - IKEA 제품 크롤링 및 임베딩 결과를 저장하는 데 사용
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
@Builder
public class Product {

    @Id
    private String id; // MongoDB 자동 ObjectId 또는 IKEA ID

    private String name;           // 제품명
    private String description;    // 간단 설명
    private String detail;         // 상세 설명 (캡셔닝 결과)
    private String price;          // 가격 (₩단위 포함 또는 int)
    private String link;           // IKEA 상세 링크
    private String imageUrl;       // 대표 이미지 URL
    private String model3dUrl;     // 3D 이미지 URL(태원)
    private String csv;            // 출처 csv 파일명

    private String category;
    private List<Double> imageEmbedding;    // CLIP 기반 이미지 벡터
    private List<Double> textEmbedding;     // 텍스트 기반 설명 벡터
    private List<Double> combinedEmbedding; //결합된 임베딩 값
    
    private LocalDateTime updatedAt;        //제품 등록 시간
    private LocalDateTime createdAt;        //제품 수정 시간

}
