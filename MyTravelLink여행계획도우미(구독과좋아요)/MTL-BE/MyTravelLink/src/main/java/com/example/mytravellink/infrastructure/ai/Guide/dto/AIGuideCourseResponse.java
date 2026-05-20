package com.example.mytravellink.infrastructure.ai.Guide.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class AIGuideCourseResponse {

    @JsonProperty("plan_type")
    private String planType;

    @JsonProperty("daily_plans")
    private List<DailyPlans> dailyPlans;

}

//  private List<CourseResp> courseList;
//
//
//  @Data
//  @AllArgsConstructor
//  @NoArgsConstructor
//  private static class CourseResp {
//    private int courseNumber;
//    private List<CoursePlaceResp> coursePlaceList;
//
//    @Data
//    @AllArgsConstructor
//    @NoArgsConstructor
//    private static class CoursePlaceResp {
//      private String placeId;
//      private int placeNum;
//    }
//  }
//
//  @Getter
//  @Setter
//  @Builder
//  public static class CourseDTO {
//    private int courseNumber;
//    private List<PlaceDTO> places;
//
//    @Getter
//    @Setter
//    @Builder
//    public static class PlaceDTO {
//      private String placeId;
//      private int placeNum;
//    }
//  }
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//  // 외부 사용을 위한 메서드
//  public List<CourseDTO> getCourses() {
//    return courseList.stream()
//      .map(this::convertToCourseDTO)
//      .collect(Collectors.toList());
//  }
//  // private -> CourseDTO 변환 메서드
//  private CourseDTO convertToCourseDTO(CourseResp courseResp) {
//    return CourseDTO.builder()
//      .courseNumber(courseResp.getCourseNumber())
//      .places(courseResp.getCoursePlaceList().stream()
//        .map(this::convertToPlaceDTO)
//        .collect(Collectors.toList()))
//      .build();
//  }
//  // private -> PlaceDTO 변환 메서드
//  private CourseDTO.PlaceDTO convertToPlaceDTO(CourseResp.CoursePlaceResp placeResp) {
//    return CourseDTO.PlaceDTO.builder()
//      .placeId(placeResp.getPlaceId())
//      .placeNum(placeResp.getPlaceNum())
//      .build();
//  }
//}