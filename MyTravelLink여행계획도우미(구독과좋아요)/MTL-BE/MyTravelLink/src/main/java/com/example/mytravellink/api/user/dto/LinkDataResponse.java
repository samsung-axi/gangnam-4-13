package com.example.mytravellink.api.user.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LinkDataResponse {
    // DB의 u.id는 SHA-512 해시 문자열이므로 String 타입입니다.
    private String id;
    // u.urlTitle 컬럼 값을 저장합니다.
    @JsonProperty("url_title")  // JSON 출력 시 key가 "url_title"로 노출됨
    private String urlTitle;
    // u.url 컬럼 값을 저장합니다.
    private String url;      // 실제 URL (u.url)
    // URL에 'youtube'가 포함되어 있으면 "youtube", 그렇지 않으면 "blog"
    private String type;
    private LocalDateTime updateAt;
    
    // 4-파라미터 생성자 : JPQL 쿼리에서 호출
    public LinkDataResponse(String id, String urlTitle, String url, LocalDateTime updateAt) {
        this.id = id;
        this.urlTitle = urlTitle;
        this.url = url;
        this.updateAt = updateAt;
        this.type = determineType(url);
    }

    // 추가된 3개 인자 생성자 (url 정보가 없으면 기본값 "blog")
    public LinkDataResponse(String id, String urlTitle, LocalDateTime updateAt) {
        this.id = id;
        this.urlTitle = urlTitle;
        this.updateAt = updateAt;
        this.type = "blog";
    }
    
    /**
     * URL 문자열을 기반으로 링크 유형을 판별하여 반환합니다.
     * youtube.com 또는 youtu.be가 포함된 경우 "youtube", 그렇지 않으면 "blog"를 반환합니다.
     */
    public static String determineType(String url) {
        if (url != null) {
            String lowered = url.toLowerCase().trim();
            if (lowered.contains("youtube.com") || lowered.contains("youtu.be")) {
                return "youtube";
            }
        }
        return "blog";
    }

    // Getter / Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrlTitle() {
        return urlTitle;
    }

    public void setUrlTitle(String urlTitle) {
        this.urlTitle = urlTitle;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }
} 