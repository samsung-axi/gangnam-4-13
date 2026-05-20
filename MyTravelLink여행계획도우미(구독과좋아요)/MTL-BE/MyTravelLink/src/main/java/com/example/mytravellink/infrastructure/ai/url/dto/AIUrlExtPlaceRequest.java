package com.example.mytravellink.infrastructure.ai.url.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIUrlExtPlaceRequest {
  private List<Urlinfo> urlInfoList;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  class Urlinfo {
    private String urlId;
    private String url;
    private String title;
    private String author;
  }
}
