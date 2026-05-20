package com.banghyang.diffuser.dto;

import lombok.Data;

import java.util.List;

@Data
public class DiffuserKeywordResponse {

    private List<DiffuserResponse.Recommendation> recommendations;
    private String usageRoutine;
    private String therapyTitle;
    private List<String> imageUrls;

}
