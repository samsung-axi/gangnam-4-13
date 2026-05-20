package com.example.mytravellink.domain.travel.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.example.mytravellink.infrastructure.ai.Guide.dto.*;
import org.springframework.stereotype.Service;

import com.example.mytravellink.infrastructure.ai.Guide.AIGuideInfrastructure;
import com.example.mytravellink.api.travelInfo.dto.travel.AIPlace;
import com.example.mytravellink.api.travelInfo.dto.travel.TravelInfoPlaceResponse;
import com.example.mytravellink.domain.travel.entity.Place;
import com.example.mytravellink.domain.travel.repository.PlaceRepository;
import com.example.mytravellink.domain.travel.repository.TravelInfoPlaceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {
  
  private final PlaceRepository placeRepository;
  private final TravelInfoPlaceRepository travelInfoPlaceRepository;
  private final AIGuideInfrastructure aiGuideInfrastructure;


  /**
   * 장소 조회
   * @param id 장소 ID
   * @return 장소
   */
  @Override
  public Place findById(String id) {
    return placeRepository.findById(id).orElseThrow(() -> new RuntimeException("Place not found"));
  }


  /**
   * AI 코스 추천
   * @param placeIds 장소 ID 리스트
   * @param dayNum 여행 일수
   * @return AI 코스 추천 응답
   */

  @Override
  public List<AIGuideCourseResponse> getAIGuideCourse(AIGuideCourseRequest aiGuideCourseRequest, int travelDays) {

    List<AIPlace> places = new ArrayList<>();
    for(AIPlace place : aiGuideCourseRequest.getPlaces()) {
      AIPlace tmpPlace =AIPlace.builder()
        .id(place.getId())
        .address(place.getAddress())
        .title(place.getTitle())
        .description(place.getDescription() != null ? place.getDescription() : "")
        .intro(place.getIntro() != null ? place.getIntro() : "")
        .type(place.getType() != null ? place.getType() : "")
        .image(place.getImage() != null ? place.getImage() : "")
        .latitude(place.getLatitude())
        .longitude(place.getLongitude())
        .openHours(place.getOpenHours() != null ? place.getOpenHours() : "")
        .phone(place.getPhone() != null ? place.getPhone() : "")
        .rating(place.getRating() != null ? place.getRating() : BigDecimal.ZERO)
        .build();
      places.add(tmpPlace);
    }

    AIGuideCourseRequest request = AIGuideCourseRequest.builder()
      .places(places)
      .travelDays(travelDays)
      .build();

    List<AIGuideCourseResponse> aiGuideCourseResponses = aiGuideInfrastructure.getGuideRecommendation(request);


    return aiGuideCourseResponses;
  }

  /**
   * AI 장소 선택
   * @param travelInfoId 여행 정보 ID
   * @param travelDays 여행 일수
   * @return AI 장소 선택 응답
   */
  @Override
  public TravelInfoPlaceResponse getAISelectPlace(String travelInfoId, int travelDays) {
    List<String> placeIdList = travelInfoPlaceRepository.findByTravelInfoId(travelInfoId);
    List<Place> placeList = placeRepository.findByIds(placeIdList);

    // AI 장소 선택
    try {
      AISelectedPlaceRequest aiSelectedPlaceRequest = AISelectedPlaceRequest.builder()
        .placeList(placeList)
        .travelDays(travelDays)
        .build();

      AISelectedPlaceResponse aiSelectedPlaceResponse = aiGuideInfrastructure.getAISelectPlace(aiSelectedPlaceRequest);
      return TravelInfoPlaceResponse.builder()
        .success("success")
        .message("AI 장소 선택 성공")
        .content(aiSelectedPlaceResponse.dtoConvert())
        .build();
    } catch (Exception e) {
      throw new IllegalArgumentException("AI 장소 선택 실패");
    }
  }

  /**
   * 장소 조회
   * @param placeIds 장소 ID 리스트
   * @return 장소 리스트
   */
  @Override
  public List<Place> getPlacesByIds(List<String> placeIds) {
    return placeRepository.findByIds(placeIds);
  }

  /**
   * 여행 정보 첫 장소 이미지 조회
   * @param travelInfoId 여행 정보 ID
   * @return 장소 이미지
   */
  @Override
  public String getPlaceImage(String travelInfoId) {
    List<String> placeIds = travelInfoPlaceRepository.findByTravelInfoId(travelInfoId);
    Place place = placeRepository.findById(placeIds.get(0)).orElseThrow(() -> new RuntimeException("Place not found"));
    String imageUrl = place.getImage();
    return imageUrl;
  }
}

