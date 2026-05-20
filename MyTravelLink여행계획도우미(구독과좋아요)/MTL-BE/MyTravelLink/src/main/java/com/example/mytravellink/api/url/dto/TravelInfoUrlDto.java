package com.example.mytravellink.api.url.dto;

public class TravelInfoUrlDto {
    private String urlId;
    private String url;
    private String urlTitle;

    public TravelInfoUrlDto(String urlId, String url, String urlTitle) {
        this.urlId = urlId;
        this.url = url;
        this.urlTitle = urlTitle;
    }

    public String getUrlId() {
        return urlId;
    }

    public void setUrlId(String urlId) {
        this.urlId = urlId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrlTitle() {
        return urlTitle;
    }

    public void setUrlTitle(String urlTitle) {
        this.urlTitle = urlTitle;
    }
} 