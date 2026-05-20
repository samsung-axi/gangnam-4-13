package com.example.mytravellink.api.travelInfo.dto.travel;

import java.util.List;

import lombok.*;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PlaceSelectRequest {
  private String travelInfoId;
  private Integer travelDays;
  private String travelTaste;
  private List<String> placeIds;
}
