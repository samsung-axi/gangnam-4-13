package com.example.mytravellink.domain.travel.service;

import java.util.List;

import com.example.mytravellink.api.travelInfo.dto.travel.GuideBookResponse;
import com.example.mytravellink.domain.travel.entity.Place;

public interface ImageService {
  
  /**
   * 가이드 북 장소 이미지 리다이렉트
   * @param courseList
   * @return
   */
  public List<GuideBookResponse.CourseList> redirectImageUrl(List<GuideBookResponse.CourseList> courseList);

  /**
   * 장소 리스트 이미지 리다이렉트
   * @param placeList
   * @return
   */
  public List<Place> redirectImageUrlPlace(List<Place> placeList);

  /**
   * 장소 이미지 리다이렉트
   * @param imageUrl
   * @return
   */
  public String redirectImageUrl(String imageUrl);

}
