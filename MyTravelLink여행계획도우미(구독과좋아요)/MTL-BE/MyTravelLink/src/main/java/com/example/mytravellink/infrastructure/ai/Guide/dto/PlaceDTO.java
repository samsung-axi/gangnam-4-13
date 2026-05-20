package com.example.mytravellink.infrastructure.ai.Guide.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class PlaceDTO {

    private String id;
    private String name;
    private String address;

    @JsonProperty("official_description")
    private String officialDescription;

    @JsonProperty("reviewer_description")
    private String reviewerDescription;

    @JsonProperty("place_type")
    private String placeType;

    private BigDecimal rating;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("business_hours")
    private String businessHours;

    private String website;

    private BigDecimal latitude;
    private BigDecimal longitude;
}
