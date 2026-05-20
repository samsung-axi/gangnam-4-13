package com.example.mytravellink.api.travelInfo.dto.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaceMoveRequest {
  private String beforeCourseId;
  private String afterCourseId;
  private String placeId;
}
