package com.example.mytravellink.domain.travel.service;

import com.example.mytravellink.infrastructure.ai.Guide.dto.*;
import com.example.mytravellink.api.travelInfo.dto.travel.PlaceSelectRequest;
import com.example.mytravellink.domain.travel.entity.Guide;
import com.example.mytravellink.domain.travel.entity.TravelInfo;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface GuideService {

  /**
   * 가이드 조회
   * @param guideId
   * @return Guide
   */
  Guide getGuide(String guideId);


  /**
   * 여행정보 조회
   * @param guideId
   * @return TravelInfo
   */
  TravelInfo getTravelInfo(String guideId);

    /**
     * 가이드 생성
     * @param guide
     * @param aiGuideCourseResponse
     * @return CompletableFuture<String>
     */
    // CompletableFuture<String> createGuideAndCourses(Guide guide, List<AIGuideCourseResponse> aiGuideCourseResponse);
    String createGuideAndCourses(Guide guide, List<AIGuideCourseResponse> aiGuideCourseResponse);

    /**
     * 가이드 북 제목 수정
     * @param guideId
     * @param title
     */
    void updateGuideBookTitle(String guideId, String title);

    /**
     * 가이드 북 목록 조회
     * @param userEmail
     * @return List<Guide>
     */
    List<Guide> getGuideList(String userEmail);

    /**
     * 가이드 북 즐겨찾기 여부 수정
     * @param guideId
     * @param isFavorite
     */
    void updateGuideBookFavorite(String guideId, boolean isFavorite);

    /**
     * 가이드 북 고정 여부 수정
     * @param guideId
     * @param isFixed
     */
    void updateGuideBookFixed(String guideId, boolean isFixed);

    /**
     * 가이드 북 삭제
     * @param guideId
     */
    void deleteGuideBook(String guideId);

    /**
     * 가이드 북 사용자 여부 조회
     * @param guideId
     * @param userEmail
     * @return boolean
     */
    boolean isUser(String guideId, String userEmail);
    
    /**
     * 가이드 북 비동기 생성
     * @param placeSelectRequest
     * @param jobId
     */
    void createGuideAsync(PlaceSelectRequest placeSelectRequest, String jobId, String email);

    /**
     * 가이드 북 생성
     * @param placeSelectRequest
     * @return String
     */
    String createGuide(PlaceSelectRequest placeSelectRequest, String email);  
}

