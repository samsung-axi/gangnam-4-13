package com.bangkoo.back.mapper;

import com.bangkoo.back.dto.product.ProductsRequestDTO;
import com.bangkoo.back.dto.product.ProductsResponseDTO;
import com.bangkoo.back.model.product.Product;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ProductDtoMapper {

    public Product toEntity(ProductsRequestDTO dto) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setDetail(dto.getDetail());
        product.setPrice(dto.getPrice());
        product.setLink(dto.getLink());
        product.setImageUrl(dto.getImageUrl());
        product.setModel3dUrl(dto.getModel3dUrl());
        product.setCreatedAt(LocalDateTime.now());
        return product;
    }

    public ProductsResponseDTO toResponseDTO(Product product) {
        ProductsResponseDTO dto = new ProductsResponseDTO();
        dto.setId(product.getId());
        dto.setLink(product.getLink());
        dto.setImageUrl(product.getImageUrl());
        dto.setDescription(product.getDescription());
        dto.setModel3dUrl(product.getModel3dUrl());
        dto.setName(product.getName());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }
}
