package com.banghyang.object.spice.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpiceCreateRequest {
    // 향료 생성 DTO
    private String nameEn;
    private String nameKr;
    private String contentEn;
    private String contentKr;
    private List<String> imageUrlList;
    private String lineName;
}
