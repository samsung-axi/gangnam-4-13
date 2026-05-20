package com.example.mytravellink.domain.travel.service;

import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mytravellink.domain.travel.entity.Place;
import com.example.mytravellink.domain.travel.entity.TravelInfo;
import com.example.mytravellink.domain.travel.repository.PlaceRepository;
import com.example.mytravellink.domain.travel.repository.TravelInfoPlaceRepository;
import com.example.mytravellink.domain.travel.repository.TravelInfoRepository;
import com.example.mytravellink.domain.url.repository.TravelInfoUrlRepository;
import com.example.mytravellink.domain.url.repository.UrlRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class TravelInfoServiceImpl implements TravelInfoService {
  
  private static final Logger log = LoggerFactory.getLogger(TravelInfoServiceImpl.class);

  private final TravelInfoRepository travelInfoRepository;
  private final TravelInfoPlaceRepository travelInfoPlaceRepository;
  private final PlaceRepository placeRepository;
  private final TravelInfoUrlRepository travelInfoUrlRepository;
  private final UrlRepository urlRepository;

  /**
   * 여행정보 ID 기준 여행정보 조회
   * @param travelId
   * 
   * @return TravelInfo
   * 
   */
  @Transactional(readOnly = true)
  public TravelInfo getTravelInfo (String travelInfoId) {
    return travelInfoRepository.findById(travelInfoId)
        .orElseThrow(() -> new RuntimeException("TravelInfo not found with id: " + travelInfoId));
  }
  
  /**
   * 여행정보 ID 기준 장소 조회
   * @param travelInfoId
   * 
   * @return List<Place>
   */
  @Transactional(readOnly = true)
  public List<Place> getTravelInfoPlace(String travelInfoId) {
    try {
      log.info("Fetching places for travelInfoId: {}", travelInfoId);
      
      // 먼저 travelInfo가 존재하는지 확인
      TravelInfo travelInfo = travelInfoRepository.findById(travelInfoId)
          .orElseThrow(() -> {
            log.error("TravelInfo not found with id: {}", travelInfoId);
            return new RuntimeException("TravelInfo not found with id: " + travelInfoId);
          });

      if (travelInfo.isDelete()) {
        log.info("TravelInfo is marked as deleted. travelInfoId: {}", travelInfoId);
        return new ArrayList<>();
      }

      List<String> placeIdList = travelInfoPlaceRepository.findByTravelInfoId(travelInfoId);
      log.debug("Found placeIds: {}", placeIdList);
      
      if (placeIdList.isEmpty()) {
        log.info("No places found for travelInfoId: {}", travelInfoId);
        return new ArrayList<>();
      }

      log.info("Found {} places for travelInfoId: {}", placeIdList.size(), travelInfoId);
      
      List<Place> placeList = new ArrayList<>();
      for (String placeId : placeIdList) {
        try {
          placeRepository.findById(placeId)
              .ifPresentOrElse(
                  place -> {
                    log.debug("Found place: {} (id: {})", place.getTitle(), placeId);
                    placeList.add(place);
                  },
                  () -> log.warn("Place not found with id: {}", placeId)
              );
        } catch (Exception e) {
          log.error("Error finding place with id: {} - {}", placeId, e.getMessage(), e);
          // 개별 장소 조회 실패는 무시하고 계속 진행
          continue;
        }
      }

      log.info("Successfully retrieved {} places out of {} placeIds for travelInfoId: {}", 
          placeList.size(), placeIdList.size(), travelInfoId);
      return placeList;

    } catch (Exception e) {
      log.error("Error in getTravelInfoPlace for travelInfoId: {} - {}", travelInfoId, e.getMessage(), e);
      throw new RuntimeException("Failed to get travel info places: " + e.getMessage(), e);
    }
  }

  /**
   * 여행정보 ID 기준 여행정보 수정
   * 제목, 여행일 수정
   * @param travelInfoId
   * @param travelInfoUpdateTitleAndTravelDaysRequest
   */
  public void updateTravelInfo(String travelInfoId, String travelInfoTitle, Integer travelDays) {
    travelInfoRepository.updateTravelInfo(travelInfoId, travelInfoTitle, travelDays);
  }

  /**
   * 여행정보 ID 기준 장소 수 조회
   * @param travelInfoId
   * 
   * @return int 
   */
  public int getPlaceCnt(String travelInfoId) {return travelInfoPlaceRepository.getPlaceCnt(travelInfoId);}

  /**
   * UserID 기준 여행 정보 조회
   * @param userId
   * 
   */
  public List<TravelInfo> getTravelInfoList(String userEmail) {
    return travelInfoRepository.findByUserEmail(userEmail);
    }

  /**
   * 여행 정보 ID 기준 즐겨찾기 여부 수정
   * @param travelInfoId
   * @param isFavorite
   */
  public void updateFavorite(String travelInfoId, Boolean isFavorite) {
    travelInfoRepository.updateFavorite(travelInfoId, isFavorite);
  }

  /**
   * 여행 정보 ID 기준 고정 여부 수정
   * @param travelInfoId
   * @param fixed
   */
  public void updateFixed(String travelInfoId, Boolean fixed) {
    travelInfoRepository.updateFixed(travelInfoId, fixed);
  }

  /**
   * 여행 정보 ID 기준 여행 정보 삭제
   * @param travelInfoId
   */
  public void deleteTravelInfo(String travelInfoId) {
    travelInfoRepository.updateDeleted(travelInfoId, true);
  } 

  /**
   * 여행 정보 ID 기준 URL 작성자 조회
   * @param travelInfoId
   * 
   * @return List<String>
   */
  public List<String> getUrlAuthors(String travelInfoId) {
    List<String> urlIdList = travelInfoUrlRepository.findUrlIdByTravelInfoId(travelInfoId);

    List<String> urlAuthorList = new ArrayList<>();

    for (String urlId : urlIdList) {
      urlAuthorList.add(urlRepository.findById(urlId).orElseThrow(() -> new RuntimeException("Url not found")).getUrlAuthor());
    }

    return urlAuthorList;
  }

  /**
   * UserID 기준 가이드 수 조회
   * @param userId
   * 
   * @return int
   */
  public int getGuideCount(String userEmail) {return travelInfoRepository.getGuideCount(userEmail);}  

  /**
   * 여행 정보 ID, 사용자 이메일 기준 사용자 여부 조회
   * @param travelId
   * @param userEmail
   */
  public boolean isUser(String travelId, String userEmail) {return travelInfoRepository.isUser(travelId, userEmail);}
}