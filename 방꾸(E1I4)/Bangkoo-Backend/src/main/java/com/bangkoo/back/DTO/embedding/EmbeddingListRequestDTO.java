package com.bangkoo.back.dto.embedding;

import lombok.Data;

import java.util.List;

@Data
public class EmbeddingListRequestDTO {
    private List<EmbeddingRequestDTO> products;
}
