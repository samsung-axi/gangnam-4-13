package com.example.mytravellink.infrastructure.ai.Guide.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoPlaceResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AISelectedPlaceResponse {
  String success;
  String message;
  List<Place> content;

  @Data
  @Builder
  public static class Place {
    String urlId;
    String placeId;
    String placeType;
    String placeName;
    String placeAddress;
    String placeImage;
    String placeDescription;
    String intro;
    BigDecimal latitude;
    BigDecimal longitude;
  }

  public List<TravelInfoPlaceResponse.Place> dtoConvert() {
    return this.content.stream()
      .map(place -> TravelInfoPlaceResponse.Place.builder()
        .placeId(place.getPlaceId())
        .placeType(place.getPlaceType())
        .placeName(place.getPlaceName())
        .build())
      .collect(Collectors.toList());
  }
}
