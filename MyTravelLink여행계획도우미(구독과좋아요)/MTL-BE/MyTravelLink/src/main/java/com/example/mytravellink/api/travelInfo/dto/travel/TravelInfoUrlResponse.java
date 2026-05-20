package com.example.mytravellink.api.travelInfo.dto.travel;

import java.util.List;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class TravelInfoUrlResponse {
  String success;
  String message;
  String travelInfoId;
  String travelInfoTitle;
  Integer travelDays;
  Integer urlCnt;
  List<Url> urlList;

  @Data
  @Builder
  public static class Url {
    String urlId;
    String urlAddress;
    String title;
    String author;
  }
}
