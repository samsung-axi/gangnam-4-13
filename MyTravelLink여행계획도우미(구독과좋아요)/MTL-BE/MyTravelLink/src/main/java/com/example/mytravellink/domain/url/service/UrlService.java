package com.example.mytravellink.domain.url.service;

import com.example.mytravellink.api.url.dto.UrlRequest;
import com.example.mytravellink.api.url.dto.UrlResponse;
import com.example.mytravellink.api.url.dto.UserUrlRequest;
import com.example.mytravellink.domain.travel.entity.TravelInfo;
import com.example.mytravellink.domain.url.entity.Url;
import com.example.mytravellink.domain.travel.entity.Place;
import java.util.List;

public interface UrlService {

    // FASTAPI를 통한 URL 처리
    UrlResponse processUrl(UrlRequest urlRequest);
    
    // TravelInfo에 연관된 URL 목록 조회
    List<Url> findUrlByTravelInfoId(TravelInfo travelInfo);

    // URL과 연결된 Place 목록 조회
    List<Place> findPlaceByUrlId(String urlId);

    // 여행 정보와 URL을 연결하여 URL 저장 처리 (기존 사용)
    void saveUrl(String travelInfoId, String url, String title, String author);

    // 사용자 요청에 의한 URL 저장 (JWT 토큰을 통한 사용자 구분)
    void saveUserUrl(String email, UserUrlRequest request);

    // 사용자 요청에 의한 URL 삭제
    void deleteUserUrl(String email, String urlId);

    // 새롭게 추가: URL 문자열을 전달받아 해시 계산 후 삭제
    void deleteUserUrlByUrl(String email, String url);

    // URL 매핑 처리 (email 파라미터 추가)
    String mappingUrl(UrlRequest request, String email);
    
    // 새롭게 추가: 유튜브 영상 URL을 받아 자막 체크 (FastAPI 호출)
    boolean checkYoutubeSubtitles(String videoUrl);

    void processUrlAsync(UrlRequest urlRequest, String jobId);

    // URL 사용자 확인
    boolean isUser(String urlId, String userEmail);
    
}
