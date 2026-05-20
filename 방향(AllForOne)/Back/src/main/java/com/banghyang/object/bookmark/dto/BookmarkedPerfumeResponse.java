package com.banghyang.object.bookmark.dto;

import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 북마크한 향수 정보를 응답하기 위한 DTO
 */
@Getter
public class BookmarkedPerfumeResponse {

    private final Long productId;      // 제품 ID
    private final String nameKr;       // 제품 한글명
    private final String brand;        // 제품 브랜드
    private final List<String> imageUrls; // 제품 이미지 리스트

    /**
     * @param product 북마크된 제품 정보
     */
    public BookmarkedPerfumeResponse(Product product, List<String> imageUrls) {
        this.productId = product.getId();
        this.nameKr = product.getNameKr();
        this.brand = product.getBrand();
        this.imageUrls = imageUrls.isEmpty()
                ? List.of("https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg")
                : imageUrls;
    }

    /**
     * 제품의 모든 이미지 URL을 가져오는 메소드
     * @param product 제품 엔티티
     * @param productImageRepository 제품 이미지 리포지토리
     * @return 이미지 URL 리스트 (없으면 기본값 1개 포함)
     */
    private List<String> extractImageUrls(Product product, ProductImageRepository productImageRepository) {
        List<String> urls = productImageRepository.findByProduct(product).stream()
                .map(ProductImage::getUrl)
                .collect(Collectors.toList());

        if (urls.isEmpty()) {
            urls.add("https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg"); // 기본 이미지 추가
        }

        return urls;
    }
}
