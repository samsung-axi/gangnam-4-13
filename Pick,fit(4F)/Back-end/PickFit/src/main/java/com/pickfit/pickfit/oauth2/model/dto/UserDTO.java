package com.pickfit.pickfit.oauth2.model.dto;

public class UserDTO {

    private String email; // 이메일
    private String name;  // 사용자 이름
    private String phoneNum; // 폰 번호
    private String profile;
    private String address;
    private String nickname;
    private String role;

    public UserDTO() {
    }

    public UserDTO(String email, String name, String phoneNum, String profile, String address, String nickname, String role) {
        this.email = email;
        this.name = name;
        this.phoneNum = phoneNum;
        this.profile = profile;
        this.address = address;
        this.nickname = nickname;
        this.role = role;
    }

    public UserDTO(String email, String name) {
        this.email = email;
        this.name = name;
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
        return "UserDTO{" +
                "email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", phoneNum='" + phoneNum + '\'' +
                ", profile='" + profile + '\'' +
                ", address='" + address + '\'' +
                ", nickname='" + nickname + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}