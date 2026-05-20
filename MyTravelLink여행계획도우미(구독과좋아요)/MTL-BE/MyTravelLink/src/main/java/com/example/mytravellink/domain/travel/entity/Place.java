package com.example.mytravellink.domain.travel.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.example.mytravellink.domain.url.entity.UrlPlace;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 장소 (Place) 엔티티
 * 여행지나 관광 명소와 같은 장소 정보를 저장합니다.
 * TravelInfo, Course, Url과 다대다 관계를 가지며, 각각 중간 테이블을 통해 연결됩니다.
 */
@Entity
@Table(name = "place")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Place extends BaseTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)  // 
    @Column(columnDefinition = "CHAR(36)")
    private String id;
    
    // Place -> TravelInfoPlace (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "place")
    private List<TravelInfoPlace> travelInfoPlaces = new ArrayList<>();

    // Place -> CoursePlace (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "place")
    private List<CoursePlace> coursePlaces = new ArrayList<>();

    // Place -> UrlPlace (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "place")
    private List<UrlPlace> urlPlaces = new ArrayList<>();

    private String address;
    
    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String intro;

    private String type;

    private String image;

    private String phone;

    private BigDecimal rating;

    private String website;

    @Column(columnDefinition = "DECIMAL(10,8)")
    private BigDecimal latitude;
    
    @Column(columnDefinition = "DECIMAL(11,8)")
    private BigDecimal longitude;

    @Column(columnDefinition = "TEXT")
    private String openHours;

    @Builder
    public Place(String address, String title, String description, String type, String phone, String intro,
                String image, BigDecimal latitude, BigDecimal longitude,BigDecimal rating, String website, String openHours ) {
        this.address = address;
        this.title = title;
        this.description = description;
        this.type = type;
        this.phone = phone;
        this.intro = intro;
        this.image = image;
        this.rating = rating;
        this.website = website;
        this.latitude = latitude;
        this.longitude = longitude;
        this.openHours = openHours;
    }
} 