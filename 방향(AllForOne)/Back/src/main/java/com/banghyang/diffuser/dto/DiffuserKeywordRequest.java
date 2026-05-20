package com.banghyang.diffuser.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DiffuserKeywordRequest {

    @JsonProperty("user_input")
    private String userInput;
}
