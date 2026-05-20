package com.example.mytravellink.domain.travel.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.example.mytravellink.domain.users.entity.Users;
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
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.util.ArrayList;
import java.util.List;

/**
 * 여행 정보 (TravelInfo) 엔티티
 * 사용자의 여행 계획 정보를 저장합니다.
 * User와 다대일 관계를 가지며, Place와는 다대다 관계를 가집니다.
 */
@Entity
@Table(name = "travel_info")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TravelInfo extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)  // UUID 사용
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email")
    private Users user;

    private Integer travelDays;
    
    private int placeCount;

    @Column(nullable = false)
    private String title;

    private boolean isFavorite;
    private boolean fixed;
    private boolean isDelete;

    @Column(name = "use_count", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int useCount;

    @Column(name = "ext_place_list_id", nullable = false, columnDefinition = "VARCHAR(36) DEFAULT ''")
    private String extPlaceListId;

    @Column(name = "travel_taste_id", nullable = false, columnDefinition = "VARCHAR(36) DEFAULT ''")
    private String travelTasteId;

    @JsonIgnore
    @OneToMany(mappedBy = "travelInfo")
    private List<Guide> guides = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "travelInfo")
    private List<TravelInfoPlace> travelInfoPlaces = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "travelInfo")
    private List<TravelInfoUrl> urlList = new ArrayList<>();
    
    @Builder
    public TravelInfo(Users user, Integer travelDays, int placeCount, String title,
                     boolean isFavorite, boolean fixed, boolean isDelete,
                     List<TravelInfoUrl> urlList, String extPlaceListId, String travelTasteId) {
        this.user = user;
        this.travelDays = travelDays;
        this.placeCount = placeCount;
        this.title = title;
        this.isFavorite = isFavorite;
        this.fixed = fixed;
        this.isDelete = isDelete;
        this.urlList = urlList != null ? urlList : new ArrayList<>();
        this.useCount = 0;
        this.extPlaceListId = extPlaceListId != null ? extPlaceListId : "";
        this.travelTasteId = travelTasteId != null ? travelTasteId : "";
    }
} 