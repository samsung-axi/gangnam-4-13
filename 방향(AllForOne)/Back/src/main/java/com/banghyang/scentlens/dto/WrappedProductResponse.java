package com.banghyang.scentlens.dto;

import lombok.Data;

import java.util.List;

@Data
public class WrappedProductResponse {
    private List<ProductResponse> products;
}
