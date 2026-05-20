package com.banghyang.object.product.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductModifyRequest {
    private Long id;
    private String nameEn;
    private String nameKr;
    private String brand;
    private String grade;
    private String content;
    private String sizeOption;
    private String mainAccord;
    private String ingredients;
    private List<String> topNoteList;
    private List<String> middleNoteList;
    private List<String> baseNoteList;
    private List<String> singleNoteList;
    private List<String> imageUrlList;
}