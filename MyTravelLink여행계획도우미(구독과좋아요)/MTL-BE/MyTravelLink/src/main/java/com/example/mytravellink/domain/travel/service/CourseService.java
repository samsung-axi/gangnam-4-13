package com.example.mytravellink.domain.travel.service;

import java.util.List;

import com.example.mytravellink.api.travelInfo.dto.travel.GuideBookResponse;

public interface CourseService {
  List<GuideBookResponse.CourseList> getCoursePlace(String guideId);

  void updateCoursePlace(String courseId, List<String> placeIds, String userEmail);

  void addCoursePlace(List<String> courseIds, List<String> placeIds);

  void deleteCoursePlace(String courseId, List<String> placeIds);

  void moveCoursePlace(String courseId, String beforeCourseId, String afterCourseId, String placeId);
}
