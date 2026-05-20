package com.pickfit.pickfit.oauth2.model.entity;

import com.pickfit.pickfit.multipartupload.entity.UploadEntity;
import jakarta.persistence.*;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "app_user")
public class UserEntity {

    @Id
    @Column(nullable = false, unique = true)
    private String email; // 로그인 이메일 (PK)

    @Column(nullable = false)
    private String name; // 로그인 이름

    @Column(nullable = true, name = "phone_num")
    private String phoneNum; // 휴대폰 번호

    @Column(nullable = true)
    private String profile;

    @Column(nullable = true)
    private String address;

    @Column(nullable = true)
    private String nickname;

    @Column(nullable = true)
    private String role = "USER"; // 기본값 설정

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UploadEntity> uploadedImages = new ArrayList<>();

    public List<UploadEntity> getUploadedImages() {
        return uploadedImages;
    }

    public void setUploadedImages(List<UploadEntity> uploadedImages) {
        this.uploadedImages = uploadedImages;
    }

    public UserEntity() {
    }

    public UserEntity(String email, String name, String phoneNum, String profile, String address, String nickname, String role) {
        this.email = email;
        this.name = name;
        this.phoneNum = phoneNum;
        this.profile = profile;
        this.address = address;
        this.nickname = nickname;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", phoneNum='" + phoneNum + '\'' +
                ", profile='" + profile + '\'' +
                ", address='" + address + '\'' +
                ", nickname='" + nickname + '\'' +
                ", role='" + role + '\'' +
                ", uploadedImages=" + uploadedImages.size() +
                '}';
    }
}
