package com.bangkoo.back.dto.embedding;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmbeddingProductRequestDTO {
    private String name;
    private String description;
    private String detail;
    private String imageUrl;
    private String link;
}
