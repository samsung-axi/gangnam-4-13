package com.example.mytravellink.infrastructure.ai.Guide.dto;

import java.util.List;

import com.example.mytravellink.domain.travel.entity.Place;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AISelectedPlaceRequest {
  List<Place> placeList;
  Integer travelDays;
}
