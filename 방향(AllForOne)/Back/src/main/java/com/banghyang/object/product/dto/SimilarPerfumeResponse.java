package com.banghyang.object.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimilarPerfumeResponse {
    private Long id;
    private String nameEn;
    private String nameKr;
    private String brand;
    private String mainAccord;
    private String imageUrl;
    private double similarityScore;
}
