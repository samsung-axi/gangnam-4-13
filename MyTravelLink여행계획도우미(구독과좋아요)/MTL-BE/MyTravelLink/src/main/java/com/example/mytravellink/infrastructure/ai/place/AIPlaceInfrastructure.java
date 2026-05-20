package com.example.mytravellink.infrastructure.ai.place;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.mytravellink.infrastructure.ai.common.AIServerClient;
import com.example.mytravellink.infrastructure.ai.common.exception.AIServerException;
import com.example.mytravellink.domain.travel.entity.Place;
import com.example.mytravellink.infrastructure.ai.place.dto.AIPlaceRecomRequest;
import com.example.mytravellink.infrastructure.ai.place.dto.AIPlaceRecomResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AIPlaceInfrastructure {
  private final AIServerClient aiServerClient;
  private static final String url = "api/v1/ai/places";

  public AIPlaceRecomResponse getPlaceRecommendation(List<Place> placeList, int tasteNum, int dayNum) {
    try {
      return aiServerClient.post(
      url + "/recommend", 
      AIPlaceRecomRequest.builder().placeList(placeList).tasteNum(tasteNum).dayNum(dayNum).build(),
      AIPlaceRecomResponse.class
      );
    } catch (Exception e) {
      throw new AIServerException("AI 서버 호출 실패", e);
    }
  }
}

