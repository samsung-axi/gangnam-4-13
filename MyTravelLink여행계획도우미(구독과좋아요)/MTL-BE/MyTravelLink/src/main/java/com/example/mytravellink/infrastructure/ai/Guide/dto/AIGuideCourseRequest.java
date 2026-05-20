package com.example.mytravellink.infrastructure.ai.Guide.dto;

import java.util.List;

import com.example.mytravellink.api.travelInfo.dto.travel.AIPlace;
import com.example.mytravellink.api.url.dto.PlaceInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AIGuideCourseRequest {

  @JsonProperty("places")
  private List<AIPlace> places;

  @JsonProperty("travelDays")
  private int travelDays;
}
