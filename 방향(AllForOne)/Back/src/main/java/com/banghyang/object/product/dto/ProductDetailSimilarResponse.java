package com.banghyang.object.product.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductDetailSimilarResponse {
    private Map<String, List<SimilarPerfumeResponse>> similarPerfumes;

    public ProductDetailSimilarResponse(Map<String, List<SimilarPerfumeResponse>> similarPerfumes) {
        this.similarPerfumes = similarPerfumes;
    }
}
