package com.example.mytravellink.domain.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mytravellink.domain.travel.entity.Course;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRepository extends JpaRepository<Course, String> {
  List<Course> findByGuideId(String guideId);

  @Query("SELECT COALESCE(MAX(c.courseNumber), 0) FROM Course c WHERE c.guide.id = :guide_id")
  Integer findMaxCourseNumberByGuideId(@Param("guide_id") String Id);

}
