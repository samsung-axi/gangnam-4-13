package com.example.mytravellink.domain.travel.service;

import java.util.List;

import com.example.mytravellink.infrastructure.ai.Guide.dto.AIGuideCourseRequest;
import com.example.mytravellink.infrastructure.ai.Guide.dto.AIGuideCourseResponse;
import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoPlaceResponse;
import com.example.mytravellink.domain.travel.entity.Place;

public interface PlaceService {

    /**
     * AI 코스 추천
     * @param placeIdList 장소 ID 리스트
     * @param dayNum 여행 일수
     * @return AI 코스 추천 응답
     */
  // AI 코스 추천
  List<AIGuideCourseResponse> getAIGuideCourse(AIGuideCourseRequest aiGuideCourseRequest, int dayNum);

  /**
   * AI 장소 선택
   * @param travelInfoId 여행 정보 ID
   * @param travelDays 여행 일수
   * @return AI 장소 선택 응답
   */
  TravelInfoPlaceResponse getAISelectPlace(String travelInfoId, int travelDays);

  /**
   * 장소 조회
   * @param id 장소 ID
   * @return 장소
   */
  Place findById(String id);

  /**
   * 장소 리스트 조회
   * @param placeIds 장소 ID 리스트
   * @return 장소 리스트
   */
  List<Place> getPlacesByIds(List<String> placeIds);

  /**
   * 여행 정보 첫 장소 이미지 조회
   * @param travelInfoId 여행 정보 ID
   * @return 장소 이미지
   */
  String getPlaceImage(String travelInfoId);
}

