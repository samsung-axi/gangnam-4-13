package com.banghyang.scentlens.dto;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String content;
    private Double similarity;
    private String url;
}