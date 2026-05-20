package com.example.mytravellink.domain.travel.repository.query;

import java.util.List;

public interface CoursePlaceQueryRepository {
  void updateCoursePlace(String courseId, List<String> placeIds, String userEmail);

  void updatePlaceNum(String courseId);

  void updateIsDeleted(String courseId, String placeId, boolean isDeleted);

  void updateDeleted(String courseId, String placeId, boolean isDeleted, int placeNum);

  void updateCourseMove(String beforeCourseId, String afterCourseId, String placeId);
}
