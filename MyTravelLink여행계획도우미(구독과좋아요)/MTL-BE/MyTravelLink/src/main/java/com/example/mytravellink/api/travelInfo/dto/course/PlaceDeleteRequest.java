package com.example.mytravellink.api.travelInfo.dto.course;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlaceDeleteRequest {
  private String courseId;
  private List<String> placeIds;
}

