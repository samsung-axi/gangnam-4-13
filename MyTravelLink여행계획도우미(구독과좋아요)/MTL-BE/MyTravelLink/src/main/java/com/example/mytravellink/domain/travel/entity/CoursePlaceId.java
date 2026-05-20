package com.example.mytravellink.domain.travel.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 복합키
 * CoursePlace 엔티티의 복합키를 정의하는 클래스입니다.
 * courseId와 placeId를 합쳐서 하나의 복합키로 사용합니다.
 */
@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class CoursePlaceId implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Column(name = "course_id", columnDefinition = "CHAR(36)")
    private String courseId;
    
    @Column(name = "place_id", columnDefinition = "CHAR(36)")
    private String placeId;
}
