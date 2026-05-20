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
public class PlaceRequest {
  private String id;
  private List<String> placeIds;
}
