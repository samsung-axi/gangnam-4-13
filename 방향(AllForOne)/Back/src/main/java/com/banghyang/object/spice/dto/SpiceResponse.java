package com.banghyang.object.spice.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpiceResponse {
    // 향료 조회 DTO
    private Long id;
    private String nameEn;
    private String nameKr;
    private String contentEn;
    private String contentKr;
    private List<String> imageUrlList;

    private Long lineId;
    private String lineName;
}
