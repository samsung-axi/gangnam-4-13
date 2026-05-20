package com.example.mytravellink.api.travelInfo.dto.travel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.example.mytravellink.domain.travel.entity.CoursePlace;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuideBookResponse {

  private String success;
  private String message;
  private String guideBookTitle;
  private String travelInfoTitle;
  private String travelInfoId;
  private int courseCnt;
  private List<CourseList> courses;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class CourseList {
    private String courseId;
    private int courseNum;
    private List<CoursePlaceResp> coursePlaces;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class CoursePlaceResp {
    private int num;
    private String id;
    private String name;
    private String type;
    private String description;
    private String image;
    private String address;
    private String hours;
    private String intro;
    private String latitude;
    private String longitude;
  }


  /**
   * CoursePlace 리스트 변환
   * @param coursPlace
   * @return
   */
  public static List<CoursePlaceResp> toCoursePlace(List<CoursePlace> coursPlace) {

    List<CoursePlaceResp> coursePlaceList = new ArrayList<>();

    // placeNum 오름차순 정렬
    Collections.sort(coursPlace, (a, b) -> a.getPlaceNum() - b.getPlaceNum());

    for (CoursePlace coursePlace : coursPlace) {
      CoursePlaceResp cpl = CoursePlaceResp.builder()
      .num(coursePlace.getPlaceNum())
      .id(coursePlace.getPlace().getId().toString())
      .name(coursePlace.getPlace().getTitle())
      .type(coursePlace.getPlace().getType())
      .description(coursePlace.getPlace().getDescription())
      .image(coursePlace.getPlace().getImage())
      .address(coursePlace.getPlace().getAddress())
      .hours(coursePlace.getPlace().getOpenHours())
      .intro(coursePlace.getPlace().getIntro())
      .latitude(coursePlace.getPlace().getLatitude().toString())
      .longitude(coursePlace.getPlace().getLongitude().toString())
      .build();
      coursePlaceList.add(cpl);
    }

    return coursePlaceList;
  }
}
