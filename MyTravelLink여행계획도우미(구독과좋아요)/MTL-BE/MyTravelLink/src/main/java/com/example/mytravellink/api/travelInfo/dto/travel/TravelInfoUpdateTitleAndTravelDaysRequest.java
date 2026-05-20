package com.example.mytravellink.api.travelInfo.dto.travel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelInfoUpdateTitleAndTravelDaysRequest {
  private String travelInfoTitle;
  private Integer travelDays;
}
