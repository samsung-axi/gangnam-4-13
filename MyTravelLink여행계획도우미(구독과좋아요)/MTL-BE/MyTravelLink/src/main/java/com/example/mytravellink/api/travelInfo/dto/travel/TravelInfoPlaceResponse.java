package com.example.mytravellink.api.travelInfo.dto.travel;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TravelInfoPlaceResponse {
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
}