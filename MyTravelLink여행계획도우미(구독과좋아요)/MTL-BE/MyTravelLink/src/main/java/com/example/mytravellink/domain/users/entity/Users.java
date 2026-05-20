package com.example.mytravellink.domain.users.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.example.mytravellink.domain.travel.entity.TravelInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자 (User) 엔티티
 * 사용자 정보를 저장합니다.
 * TravelInfo, UserSearchTerm, UserUrl과 다대다 관계를 가지며, 각각 중간 테이블을 통해 연결됩니다.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Users extends BaseTimeEntity {
    @Id
    private String email;
    
    private String name;
    private String profileImg;
    private boolean isDelete;

    // User -> TravelInfo (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<TravelInfo> travelInfos = new ArrayList<TravelInfo>();

    // User -> UserSearchTerm (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<UsersSearchTerm> searchTerms = new ArrayList<UsersSearchTerm>();

    // User -> UserUrl (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<UsersUrl> userUrls = new ArrayList<UsersUrl>();

    @Builder
    public Users(String email, String name, String profileImg) {
        this.email = email;
        this.name = name;
        this.profileImg = profileImg;
        this.isDelete = false;
    }
} 