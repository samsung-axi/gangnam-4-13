package com.example.mytravellink.infrastructure.ai.url.dto;

import java.util.List;

import com.example.mytravellink.domain.travel.entity.Place;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIUrlExtPlaceResponse {
  private List<UrlPlace> urlPlaceList;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  class UrlPlace {
    private String urlId;
    private List<Place> placeList;
  }
}
