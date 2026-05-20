package com.example.mytravellink.domain.travel.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mytravellink.api.travelInfo.dto.travel.GuideBookResponse;
import com.example.mytravellink.domain.travel.entity.Course;
import com.example.mytravellink.domain.travel.entity.CoursePlace;
import com.example.mytravellink.domain.travel.repository.CoursePlaceRepository;
import com.example.mytravellink.domain.travel.repository.CourseRepository;
import com.example.mytravellink.domain.travel.repository.PlaceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

  private final CourseRepository courseRepository;
  private final CoursePlaceRepository coursePlaceRepository;
  private final PlaceRepository placeRepository;

  /**
   * 코스 장소 조회
   * @param guideId
   * @return
   */
  @Transactional(readOnly = true)
  @Override
  public List<GuideBookResponse.CourseList> getCoursePlace(String guideId) {

    try {
      List<GuideBookResponse.CourseList> courseListResp = new ArrayList<>();
      List<Course> courseList = courseRepository.findByGuideId(guideId);
    
    for (Course course : courseList) {
      List<GuideBookResponse.CoursePlaceResp> coursePlaceListResp = new ArrayList<>();
      List<CoursePlace> coursePlaceList = coursePlaceRepository.findByCourseId(course.getId());
      coursePlaceListResp.addAll(GuideBookResponse.toCoursePlace(coursePlaceList));

      GuideBookResponse.CourseList courseListResult = GuideBookResponse.CourseList.builder()
        .courseId(course.getId())
        .courseNum(course.getCourseNumber())
        .coursePlaces(coursePlaceListResp)
        .build();

        courseListResp.add(courseListResult);
      }
      return courseListResp;
    } catch (Exception e) {
      return new ArrayList<>();
    }
  }

  @Override
  public void updateCoursePlace(String courseId, List<String> placeIds, String userEmail) {
    try {
      coursePlaceRepository.updateCoursePlace(courseId, placeIds, userEmail);
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 업데이트 실패", e);
    }
  }

  /**
   * 코스 장소 추가
   * @param courseIds
   * @param placeIds
   */
  @Transactional
  @Override
  public void addCoursePlace(List<String> courseIds, List<String> placeIds) {
    try {
      for (String courseId : courseIds) {

        for (String placeId : placeIds) {
          if(coursePlaceRepository.isPresent(courseId, placeId)) {
            coursePlaceRepository.updateDeleted(courseId, placeId, false, coursePlaceRepository.findByCourseId(courseId).size() + 1);
            continue;
          }
          int placeNum = coursePlaceRepository.findByCourseId(courseId).size() + 1;

          coursePlaceRepository.save(CoursePlace.builder()
            .course(courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found")))
            .place(placeRepository.findById(placeId).orElseThrow(() -> new RuntimeException("Place not found")))
            .placeNum(placeNum)
            .build());
        }
      }
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 추가 실패", e);
    }
  }

  /**
   * 코스 장소 삭제
   * @param courseId
   * @param placeIds
   */
  @Transactional
  @Override
  public void deleteCoursePlace(String courseId, List<String> placeIds) {
    try {
      for(String placeId : placeIds) {
        // 이미 삭제된 경우 넘어감
        if(!coursePlaceRepository.isDeleted(courseId, placeId)) {
          // 해당 장소 isDeleted 컬럼을 true로 업데이트
          coursePlaceRepository.updateIsDeleted(courseId, placeId, true);
        }
      }
       // isDeleted 컬럼이 true인 장소 순서 업데이트
       coursePlaceRepository.updatePlaceNum(courseId);
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 삭제 실패", e);
    }
  }

  /**
   * 코스 장소 이동
   * @param courseId
   * @param beforeCourseId
   * @param afterCourseId
   * @param placeId
   */
  @Transactional
  @Override
  public void moveCoursePlace(String courseId, String beforeCourseId, String afterCourseId, String placeId) {
    try {
      coursePlaceRepository.updateCourseMove(beforeCourseId, afterCourseId, placeId);
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 이동 실패", e);
    }
  }
}
