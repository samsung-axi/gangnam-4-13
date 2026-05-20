package com.example.mytravellink.domain.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mytravellink.domain.travel.entity.CoursePlace;
import com.example.mytravellink.domain.travel.entity.CoursePlaceId;
import com.example.mytravellink.domain.travel.repository.query.CoursePlaceQueryRepository;

public interface CoursePlaceRepository extends JpaRepository<CoursePlace, CoursePlaceId>, CoursePlaceQueryRepository {
  @Query("SELECT cp FROM CoursePlace cp WHERE cp.course.id = :courseId AND cp.isDeleted = false")
  List<CoursePlace> findByCourseId(@Param("courseId") String courseId);

  @Query("SELECT CASE WHEN COUNT(cp) > 0 THEN true ELSE false END FROM CoursePlace cp WHERE cp.course.id = :courseId AND cp.place.id = :placeId")
  Boolean isPresent(@Param("courseId") String courseId, @Param("placeId") String placeId);

  @Query("SELECT cp.isDeleted FROM CoursePlace cp WHERE cp.course.id = :courseId AND cp.place.id = :placeId")
  Boolean isDeleted(@Param("courseId") String courseId, @Param("placeId") String placeId);
}
