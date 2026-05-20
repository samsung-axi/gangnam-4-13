package com.example.mytravellink.api.travelInfo.dto.travel;

import java.util.List;

import com.example.mytravellink.domain.travel.entity.TravelInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TravelInfoListResponse {
  private String success;
  private String message;
  private List<Infos> travelInfoList;

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Infos {
    private String travelId;
    private String title;
    private String imgUrl;
    private Integer travelDays;
    private int placeCount;
    private String updateAt;
    private String createAt;
    private boolean isFavorite;
    private boolean fixed;
  }

  // Infos 변환 메서드
  public static Infos convertToInfos(TravelInfo travelInfo, String imgUrl) {
    return Infos.builder()
      .travelId(travelInfo.getId())
      .title(travelInfo.getTitle())
      .travelDays(travelInfo.getTravelDays())
      .placeCount(travelInfo.getPlaceCount())
      .updateAt(travelInfo.getUpdateAt().toString())
      .createAt(travelInfo.getCreateAt().toString())
      .isFavorite(travelInfo.isFavorite())
      .fixed(travelInfo.isFixed())
      .imgUrl(imgUrl)
      .build();
  }
}