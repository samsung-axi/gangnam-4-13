package com.example.mytravellink.api.travelInfo.dto.travel;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GuideBookListResponse {
  private String success;
  private String message;
  private List<GuideList> guideBooks;

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class GuideList {
    private String id;
    private String title;
    private String travelInfoTitle;
    private String createAt;
    private Integer courseCount;
    private Boolean isFavorite;
    private Boolean fixed;
    private List<String> authors;
  }
}