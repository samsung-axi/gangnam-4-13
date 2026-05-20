package com.example.mytravellink.domain.travel.service;

import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.mytravellink.api.travelInfo.dto.travel.GuideBookResponse;
import com.example.mytravellink.domain.travel.entity.Place;

@Service
public class ImageServiceImpl implements ImageService  {

  private static final Logger log = LoggerFactory.getLogger(ImageServiceImpl.class);
  private static final String DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3";

  /**
   * 코스 이미지 URL 리다이렉션
   * @param courseList
   * @return 리다이렉션된 코스 리스트
   */
  @Override
  public List<GuideBookResponse.CourseList> redirectImageUrl(List<GuideBookResponse.CourseList> courseList) {
    try {
      for(GuideBookResponse.CourseList course : courseList) {
        for(GuideBookResponse.CoursePlaceResp place : course.getCoursePlaces()) {
          String imageUrl = place.getImage();
          String redirectImageUrl = redirectImageUrl(imageUrl);
          place.setImage(redirectImageUrl);
        }
      }
      return courseList;
    } catch (Exception e) {
      log.error("코스 이미지 URL 리다이렉션 실패", e);
      return courseList;
    }
  }

  /**
   * 장소 이미지 URL 리다이렉션
   * @param placeList
   * @return 리다이렉션된 장소 리스트
   */
  @Override
  public List<Place> redirectImageUrlPlace(List<Place> placeList) {
    try {
      for(Place place : placeList) {
        String imageUrl = place.getImage();
        String redirectImageUrl = redirectImageUrl(imageUrl);
        place.setImage(redirectImageUrl);
      }
      return placeList;
    } catch (Exception e) {
      log.error("장소 이미지 URL 리다이렉션 실패", e);
      return placeList; // 에러 발생 시 원본 리스트 반환
    }
  }

  /**
   * 이미지 URL 리다이렉션
   * @param imageUrl
   * @return 리다이렉션된 이미지 URL 또는 기본 이미지 URL
   */
  public String redirectImageUrl(String imageUrl) {
    try {
      if(imageUrl == null || imageUrl.trim().isEmpty()) {
        log.debug("이미지 URL이 null 또는 빈 문자열입니다. 기본 이미지를 사용합니다.");
        return DEFAULT_IMAGE_URL;
      }

      // PlacePhoto 객체 문자열에서 URL 추출
      String extractedUrl = extractUrlFromPlacePhoto(imageUrl);
      if (extractedUrl != null) {
        return extractedUrl;
      }

      // 이미 유효한 URL인 경우 그대로 반환
      if (isValidImageUrl(imageUrl)) {
        return imageUrl;
      }

      // URL이 이미 https://로 시작하는 경우 그대로 반환
      if (imageUrl.startsWith("https://")) {
        return imageUrl;
      }

      // URL이 여전히 null이거나 빈 문자열인 경우 기본 이미지 사용
      if (imageUrl == null || imageUrl.trim().isEmpty()) {
        return DEFAULT_IMAGE_URL;
      }

      try {
        URI uri = new URI(imageUrl);
        URL originUrl = uri.toURL();

        HttpURLConnection conn = (HttpURLConnection) originUrl.openConnection();
        conn.setInstanceFollowRedirects(false);
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);

        // 리다이렉션 URL 가져오기
        String redirectUrl = conn.getHeaderField("Location");
        if (redirectUrl != null) {
          return redirectUrl;
        }

        // 응답 코드 확인
        int responseCode = conn.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
          log.debug("이미지 URL 응답 코드 {}: {}", responseCode, imageUrl);
          return DEFAULT_IMAGE_URL;
        }
      } catch (Exception e) {
        log.debug("URL 연결 실패, 원본 URL 반환: {}", imageUrl, e);
      }

      return imageUrl;
    } catch (Exception e) {
      log.error("URL 변환 실패: {}", imageUrl, e);
      return DEFAULT_IMAGE_URL;
    }
  }

  /**
   * URL이 이미 유효한 이미지 URL인지 확인
   */
  private boolean isValidImageUrl(String url) {
    if (url == null) return false;
    
    // URL 형식 검사
    if (!url.startsWith("https://")) return false;
    
    // 허용된 도메인 검사
    return url.contains("googleusercontent.com") || 
           url.contains("unsplash.com") ||
           url.contains("maps.googleapis.com/maps/api/place/photo");
  }

  /**
   * PlacePhoto 객체 문자열에서 URL 추출
   * @param input
   * @return URL 문자열 또는 null
   */
  private String extractUrlFromPlacePhoto(String input) {
    if (input == null) return null;
    
    // PlacePhoto 형식 확인
    if (input.startsWith("[PlacePhoto(") && input.endsWith(")]")) {
      // url= 다음부터 마지막 괄호 전까지의 문자열 추출
      Pattern pattern = Pattern.compile("url=([^)]+)");
      Matcher matcher = pattern.matcher(input);
      if (matcher.find()) {
        String url = matcher.group(1);
        // URL이 유효한지 확인
        if (url != null && url.startsWith("https://")) {
          return url;
        }
      }
    }
    return null;
  }

  private static class ImageData {
    private String url;
    private String redirectUrl;

    public String getUrl() {
      return url;
    }

    public void setUrl(String url) {
      this.url = url;
    }

    public String getRedirectUrl() {
      return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
      this.redirectUrl = redirectUrl;
    }
  }
}
