package com.example.mytravellink.domain.travel.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 여행 정보 장소 (TravelInfoPlace) 엔티티
 * TravelInfo와 Place 간의 다대다 관계를 위한 중간 테이블 엔티티입니다.
 * 복합 키를 사용하여 TravelInfo와 Place를 연결합니다.
 */
@Entity
@Table(name = "travel_info_place")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TravelInfoPlace extends BaseTimeEntity {
    
    @EmbeddedId
    private TravelInfoPlaceId id;

    @MapsId("tid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "travel_info_id", columnDefinition = "VARCHAR(36)")
    private TravelInfo travelInfo;
    
    @MapsId("pid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", columnDefinition = "CHAR(36)")
    private Place place;
    
    @Builder
    public TravelInfoPlace(TravelInfo travelInfo, Place place) {
        this.id = new TravelInfoPlaceId(travelInfo.getId(), place.getId());
        this.travelInfo = travelInfo;
        this.place = place;
    }
} 