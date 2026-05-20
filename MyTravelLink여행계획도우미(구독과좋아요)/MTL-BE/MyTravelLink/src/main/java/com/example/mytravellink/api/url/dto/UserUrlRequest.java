package com.example.mytravellink.api.url.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserUrlRequest {
    private String url;
    private String title;
    private String author;
    // 이 DTO는 단일 URL 정보를 담습니다.
    // 다중 URL 처리는 List<UserUrlRequest> 형태로 컨트롤러에서 처리합니다.
}