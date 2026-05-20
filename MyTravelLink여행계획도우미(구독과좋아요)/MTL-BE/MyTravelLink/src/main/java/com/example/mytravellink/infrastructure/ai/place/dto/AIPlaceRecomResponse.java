package com.example.mytravellink.infrastructure.ai.place.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AIPlaceRecomResponse {
  private List<String> placeIds;
}
