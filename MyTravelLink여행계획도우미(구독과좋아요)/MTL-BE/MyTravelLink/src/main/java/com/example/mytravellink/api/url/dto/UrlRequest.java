package com.example.mytravellink.api.url.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UrlRequest {
    private String travelInfoId;
    private List<String> urls;
    private String email;
    private Integer days;

    public String getTravelInfoId() {
        return travelInfoId;
    }

    public void setTravelInfoId(String travelInfoId) {
        this.travelInfoId = travelInfoId;
    }

    public List<String> getUrls() {
        return urls;
    }

    public void setUrls(List<String> urls) {
        this.urls = urls;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
