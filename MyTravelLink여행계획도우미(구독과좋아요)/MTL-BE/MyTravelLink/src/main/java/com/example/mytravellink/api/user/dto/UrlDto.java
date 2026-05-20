package com.example.mytravellink.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UrlDto {
    private String urlTitle;
    private String urlAuthor;
    private String url;
    // 필요에 따라 추가 필드 (예: thumbnail, publishedAt 등)
}
