package com.banghyang.object.product.dto;

import lombok.Data;

import java.util.List;

@Data
public class PerfumeResponse {
    private Long id;
    private String nameEn;
    private String nameKr;
    private String brand;
    private String grade;
    private String content;
    private String sizeOption;
    private String mainAccord;
    private String ingredients;
    private List<String> imageUrlList;
    private String singleNote;
    private String topNote;
    private String middleNote;
    private String baseNote;
    private Long price;
}
