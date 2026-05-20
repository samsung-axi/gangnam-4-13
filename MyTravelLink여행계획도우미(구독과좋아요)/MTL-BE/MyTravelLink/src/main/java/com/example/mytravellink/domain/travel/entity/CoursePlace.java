package com.example.mytravellink.domain.travel.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 코스 장소 (CoursePlace) 엔티티
 * Course와 Place 간의 다대다 관계를 위한 중간 테이블 엔티티입니다.
 * 복합 키를 사용하여 Course와 Place를 연결하며, 장소의 순서를 저장합니다.
 */
@Entity
@Table(name = "course_place")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoursePlace extends BaseTimeEntity {
    
    @EmbeddedId
    private CoursePlaceId id;
    
    @MapsId("placeId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", columnDefinition = "CHAR(36)")
    private Place place;
    
    @MapsId("courseId")
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", columnDefinition = "CHAR(36)")
    private Course course;
    
    @Column(name = "place_num", nullable = false)
    private int placeNum;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;
    
    @Builder
    public CoursePlace(Place place, Course course, int placeNum) {
        this.id = new CoursePlaceId(course.getId(), place.getId()); // 복합 키 생성
        this.place = place;
        this.course = course;
        this.placeNum = placeNum;
        this.isDeleted = false;
    }
} 