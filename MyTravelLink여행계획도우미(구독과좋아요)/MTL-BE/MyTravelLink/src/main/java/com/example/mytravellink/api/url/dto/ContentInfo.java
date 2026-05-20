package com.example.mytravellink.api.url.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString

public class ContentInfo {
    private String url;
    private String title;
    private String author;
    private String platform; // ContentType Enum을 String으로 받을 경우

    @JsonProperty("published_date")
    private String publishedDate; // Optional 처리
}
