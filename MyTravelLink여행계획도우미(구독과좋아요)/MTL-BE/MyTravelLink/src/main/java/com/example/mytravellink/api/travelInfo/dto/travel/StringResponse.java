package com.example.mytravellink.api.travelInfo.dto.travel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StringResponse {
  private String success;
  private String message;
  private String value;
}


