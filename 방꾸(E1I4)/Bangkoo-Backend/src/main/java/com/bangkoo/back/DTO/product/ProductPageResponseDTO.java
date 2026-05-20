package com.bangkoo.back.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPageResponseDTO {
    private List<ProductsResponseDTO> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}
