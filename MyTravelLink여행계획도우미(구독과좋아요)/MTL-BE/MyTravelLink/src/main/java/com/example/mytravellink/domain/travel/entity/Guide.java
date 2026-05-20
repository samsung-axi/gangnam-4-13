package com.example.mytravellink.domain.travel.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * 가이드 (Guide) 엔티티
 * 여행 정보와 관련된 가이드 정보를 저장합니다.
 * TravelInfo와 일대다 관계를 가지며, 여러 가이드를 가질 수 있습니다.
 */
@Entity
@Table(name = "guide")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Guide extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "travel_info_id")
    private TravelInfo travelInfo;

    @JsonIgnore
    @OneToMany(mappedBy = "guide")
    private List<Course> courses = new ArrayList<>();
    
    private int courseCount;
    
    @Column(nullable = false)
    private String title;
    
    private Integer travelDays;
    private boolean isFavorite;
    private boolean fixed;
    private boolean isDelete;

    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private String planTypes;
    
    @Builder
    public Guide(TravelInfo travelInfo, String title, Integer travelDays, int courseCount, boolean isFavorite, boolean fixed, boolean isDelete, String planTypes) {
        this.travelInfo = travelInfo;
        this.title = title;
        this.travelDays = travelDays;
        this.courseCount = courseCount;
        this.isFavorite = isFavorite;
        this.fixed = fixed;
        this.isDelete = isDelete;
        this.planTypes = planTypes;
    }
} 