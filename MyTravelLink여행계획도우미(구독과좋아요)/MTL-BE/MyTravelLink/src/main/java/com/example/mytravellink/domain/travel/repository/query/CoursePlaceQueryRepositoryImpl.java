package com.example.mytravellink.domain.travel.repository.query;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.mytravellink.domain.travel.entity.CoursePlace;
import com.example.mytravellink.domain.travel.entity.QCoursePlace;
import com.example.mytravellink.domain.travel.entity.QTravelInfo;
import com.example.mytravellink.domain.travel.entity.QGuide;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Repository
public class CoursePlaceQueryRepositoryImpl implements CoursePlaceQueryRepository {
  
  private final JPAQueryFactory queryFactory;
  
  private final QCoursePlace coursePlace = new QCoursePlace("coursePlace");
  private final QTravelInfo travelInfo = new QTravelInfo("travelInfo");
  private final QGuide guide = new QGuide("guide");

  @Transactional
  @Override
  public void updateCoursePlace(String courseId, List<String> placeIds, String userEmail) {

    try {
      //이메일을 이용한 사용자 확인 travelInfo 테이블과 guide, coursePlace 조인 후 travelInfo 테이블의 email과 일치하는 데이터 조회
      boolean exists = queryFactory
          .selectOne()
          .from(travelInfo)
          .join(guide).on(guide.travelInfo.eq(travelInfo))
          .join(coursePlace).on(coursePlace.course.guide.eq(guide))
          .where(travelInfo.user.email.eq(userEmail))
          .fetchFirst() != null;  // exists 쿼리로 최적화

      if(!exists) {
          throw new RuntimeException("사용자 확인 실패");
      }
      // 코스 장소 순서 수정
      for (int i = 0; i < placeIds.size(); i++) {
        queryFactory.update(coursePlace)
          .where(coursePlace.course.id.eq(courseId)
            .and(coursePlace.place.id.eq(placeIds.get(i))))
          .set(coursePlace.placeNum, i + 1)
          .execute();
      }
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 업데이트 실패", e);
    }
  }

  @Transactional
  @Override
  public void updatePlaceNum(String courseId) {
    try {
      List<CoursePlace> coursePlaceList = queryFactory.selectFrom(coursePlace)
        .where(coursePlace.course.id.eq(courseId)
          .and(coursePlace.isDeleted.eq(false)))
      .orderBy(coursePlace.placeNum.asc())
      .fetch();

    for (int i = 0; i < coursePlaceList.size(); i++) {
      queryFactory.update(coursePlace)
        .where(coursePlace.course.id.eq(courseId)
          .and(coursePlace.placeNum.eq(i + 1)))
          .set(coursePlace.placeNum, i + 1)
          .execute();
      }
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 업데이트 실패", e);
    }
  }

  @Transactional
  @Override
  public void updateIsDeleted(String courseId, String placeId, boolean isDeleted) {
    try {
      queryFactory.update(coursePlace)
        .where(coursePlace.course.id.eq(courseId)
          .and(coursePlace.place.id.eq(placeId)))
        .set(coursePlace.isDeleted, isDeleted)
        .execute();
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 업데이트 실패", e);
    }
  }

  @Transactional
  @Override
  public void updateDeleted(String courseId, String placeId, boolean isDeleted, int placeNum) {
    try {
      queryFactory.update(coursePlace)
        .where(coursePlace.course.id.eq(courseId)
          .and(coursePlace.place.id.eq(placeId)))
      .set(coursePlace.isDeleted, isDeleted)
        .set(coursePlace.placeNum, placeNum)
        .execute();
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 업데이트 실패", e);
    }
  }

  @Transactional
  @Override
  public void updateCourseMove(String beforeCourseId, String afterCourseId, String placeId) {
    try {
      // afterCourseId CoursePlace count 조회
      Long afterCoursePlaceCount = queryFactory.select(coursePlace.count())
        .from(coursePlace)
        .where(coursePlace.course.id.eq(afterCourseId)
          .and(coursePlace.isDeleted.eq(false)))
        .fetchOne();

      // 이동할 코스의 장소 컬럼 isDeleted 조회
      Boolean isDeleted = queryFactory.select(coursePlace.isDeleted)
        .from(coursePlace)
        .where(coursePlace.course.id.eq(afterCourseId)
          .and(coursePlace.place.id.eq(placeId)))
        .fetchOne();

      if (isDeleted) { // 이동할 코스의 장소 컬럼 isDeleted가 true일 경우 장소 수정
        queryFactory.update(coursePlace)
          .where(coursePlace.course.id.eq(afterCourseId)
            .and(coursePlace.place.id.eq(placeId)))
          .set(coursePlace.isDeleted, false)
          .set(coursePlace.placeNum, Integer.parseInt(afterCoursePlaceCount.toString()) + 1)
          .execute();
      }else{ // 이동할 코스의 장소 컬럼 isDeleted가 false일 경우 장소 새로 추가
        queryFactory.insert(coursePlace)
          .set(coursePlace.course.id, afterCourseId)
          .set(coursePlace.place.id, placeId)
          .set(coursePlace.placeNum, Integer.parseInt(afterCoursePlaceCount.toString()) + 1)
          .execute();
      }

      // 기존 코스의 장소 컬럼 isDeleted 수정
      queryFactory.update(coursePlace)
        .where(coursePlace.course.id.eq(beforeCourseId)
          .and(coursePlace.place.id.eq(placeId))
          .and(coursePlace.isDeleted.eq(false)))
        .set(coursePlace.isDeleted, true)
        .execute();

      // 기존 코스의 장소 컬럼 정렬
      List<String> beforeCoursePlaceList = queryFactory.select(coursePlace.place.id)
        .from(coursePlace)
        .where(coursePlace.course.id.eq(beforeCourseId)
          .and(coursePlace.isDeleted.eq(false)))
        .orderBy(coursePlace.placeNum.asc())
        .fetch();

      for (int i = 0; i < beforeCoursePlaceList.size(); i++) {
        queryFactory.update(coursePlace)
          .where(coursePlace.course.id.eq(beforeCourseId)
          .and(coursePlace.isDeleted.eq(false)))
          .set(coursePlace.placeNum, i + 1)
          .execute();
      }
    } catch (Exception e) {
      throw new RuntimeException("CoursePlace 이동 실패", e);
    }
  }
}

