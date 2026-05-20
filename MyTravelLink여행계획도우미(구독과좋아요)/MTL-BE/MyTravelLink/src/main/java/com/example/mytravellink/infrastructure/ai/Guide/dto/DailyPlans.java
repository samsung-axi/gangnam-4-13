package com.example.mytravellink.infrastructure.ai.Guide.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class DailyPlans {

    @JsonProperty("day_number")
    private int dayNumber;

    @JsonProperty("places")
    private List<PlaceDTO> places;
}
