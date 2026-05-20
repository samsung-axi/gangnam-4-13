package com.example.mytravellink.api.url.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder

public class UrlResponse {

    private Map<String, String> summary;

    @JsonProperty("content_infos")
    private List<ContentInfo> contentInfos; // ContentInfo DTO 필요

    @JsonProperty("place_details")
    private List<PlaceInfo> placeDetails; // PlaceInfo DTO 필요

    @JsonProperty("processing_time_seconds")
    private float processingTimeSeconds; // 응답 처리 시간

    private String url;
    private String urlTitle;

    @JsonProperty("travel_info_urls")
    private List<TravelInfoUrlDto> travelInfoUrls;
}
