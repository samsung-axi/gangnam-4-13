package com.banghyang.object.spice.dto;

import lombok.Data;

import java.util.Set;

@Data
public class SpiceModifyRequest {
    // 향료 수정 DTO
    private Long id;
    private String nameEn;
    private String nameKr;
    private String contentEn;
    private String contentKr;
    private Set<String> imageUrlList;
    private String lineName;
}
