package com.example.mytravellink.domain.url.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.example.mytravellink.domain.travel.entity.TravelInfoUrl;
import com.example.mytravellink.domain.users.entity.UsersUrl;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import jakarta.persistence.CascadeType;

/**
 * URL (Url) 엔티티
 * 외부 URL 정보를 저장합니다.
 * User, Place와 다대다 관계를 가지며, 각각 중간 테이블을 통해 연결됩니다.
 */
@Entity
@Table(name = "url")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Url extends BaseTimeEntity {
    
    @Id
    @Column(name = "id", length = 128)
    private String id;
    
    // Url -> UrlPlace (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "url", cascade = CascadeType.ALL)
    private List<UrlPlace> urlPlaces = new ArrayList<>();
    
    // Url -> UserUrl (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "url", cascade = CascadeType.ALL)
    private List<UsersUrl> usersUrls = new ArrayList<>();
    
    // Url -> TravelInfoUrl (1:N)
    @JsonIgnore
    @OneToMany(mappedBy = "url", cascade = CascadeType.ALL)
    private List<TravelInfoUrl> travelInfoUrls = new ArrayList<>();
    
    
    @Column(nullable = false)
    private String urlTitle;

    @Column(name = "url_author")
    private String urlAuthor;
    
    @Column(nullable = false)
    private String url;

    @Builder
    public Url(String urlTitle, String urlAuthor, String url) {
        this.id = generateHashFromUrl(url);
        this.urlTitle = urlTitle;
        this.urlAuthor = urlAuthor;
        this.url = url;
    }
    
    private String generateHashFromUrl(String url) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            byte[] hash = digest.digest(url.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-512 해시 생성 오류", e);
        }
    }

    public List<UrlPlace> getUrlPlaces() {
        return Collections.unmodifiableList(urlPlaces);
    }
    public List<UsersUrl> getUserUrls() {
        return Collections.unmodifiableList(usersUrls);
    }

    public void addUrlPlace(UrlPlace urlPlace) {
        if (urlPlace == null) {
            throw new IllegalArgumentException("urlPlace cannot be null");
        }
        this.urlPlaces.add(urlPlace);
        urlPlace.setUrl(this);
    }

    public void addUserUrl(UsersUrl userUrl) {
        if (userUrl == null) {
            throw new IllegalArgumentException("userUrl cannot be null");
        }
        this.usersUrls.add(userUrl);
        userUrl.setUrl(this);
    }
} 