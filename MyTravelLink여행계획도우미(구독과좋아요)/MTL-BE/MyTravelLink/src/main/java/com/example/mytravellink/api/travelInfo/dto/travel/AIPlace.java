package com.example.mytravellink.api.travelInfo.dto.travel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class AIPlace {

    private String id;
    private String address;
    private String title;
    private String description;
    private String intro;
    private String type;
    private String image;
    private float latitude;
    private float longitude;

    @JsonProperty("open_hours")
    private String openHours;
    private String phone;
    private BigDecimal rating;
}
