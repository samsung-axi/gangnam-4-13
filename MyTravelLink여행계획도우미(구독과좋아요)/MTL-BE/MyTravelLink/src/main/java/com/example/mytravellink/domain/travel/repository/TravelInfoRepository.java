package com.example.mytravellink.domain.travel.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.mytravellink.domain.travel.entity.TravelInfo;



public interface TravelInfoRepository extends JpaRepository<TravelInfo, String> {

  /**
   * ID 기준 여행정보 조회
   * @param id
   * @return Optional<TravelInfo>
   */
  Optional<TravelInfo> findById(String id);

  /**
   * ID와 사용자 이메일 기준 여행정보 조회
   * @param id
   * @param userEmail
   * @return Optional<TravelInfo>
   */
  @Query("SELECT t FROM TravelInfo t WHERE t.id = :id AND t.user.email = :userEmail AND t.isDelete = false")  
  Optional<TravelInfo> findByIdAndUserEmail(@Param("id") String id, @Param("userEmail") String userEmail);
  
  /**
   * 여행정보 수정
   * @param id
   * @param title
   * @param travelDays
   */
  @Modifying
  @Transactional
  @Query("UPDATE TravelInfo SET title = :title, travelDays = :travelDays WHERE id = :id AND isDelete = false")
  void updateTravelInfo(@Param("id") String id, @Param("title") String title, @Param("travelDays") Integer travelDays);

  /**
   * 사용자 이메일 기준 여행정보 조회
   * @param userEmail
   * @return List<TravelInfo>
   */
  @Query("SELECT t FROM TravelInfo t WHERE t.user.email = :userEmail AND t.isDelete = false")
  List<TravelInfo> findByUserEmail(@Param("userEmail") String userEmail);

  /**
   * 사용자 이메일 기준 여행정보 ID 조회
   * @param userEmail
   * @return List<String>
   */
  @Query("SELECT t.id FROM TravelInfo t WHERE t.user.email = :userEmail AND t.isDelete = false")
  List<String> findTravelInfoIdByUserEmail(@Param("userEmail") String userEmail);

  /**
   * 여행정보 즐겨찾기 수정
   * @param id
   * @param isFavorite
   */
  @Modifying
  @Transactional
  @Query("UPDATE TravelInfo SET isFavorite = :isFavorite WHERE id = :id")
  void updateFavorite(@Param("id") String id, @Param("isFavorite") Boolean isFavorite);

  /**
   * 여행정보 고정 수정
   * @param id
   * @param fixed
   */
  @Modifying
  @Transactional
  @Query("UPDATE TravelInfo SET fixed = :fixed WHERE id = :id")
  void updateFixed(@Param("id") String id, @Param("fixed") Boolean fixed);

  /**
   * 여행정보 삭제 수정
   * @param id
   * @param isDelete
   */
  @Modifying
  @Transactional
  @Query("UPDATE TravelInfo SET isDelete = :isDelete WHERE id = :id")
  void updateDeleted(@Param("id") String id, @Param("isDelete") Boolean isDelete);

  /**
   * EMAIL 기준 가이드 수 조회
   * travelInfo 테이블과 guide 테이블의 연관관계를 통해 가이드 수 조회  
   * @param userEmail
   * 
   * @return int
   */
  @Query("SELECT COUNT(g) FROM Guide g " +
         "JOIN g.travelInfo t " +
         "WHERE t.user.email = :userEmail " +
         "AND g.isDelete = false")
  int getGuideCount(@Param("userEmail") String userEmail);

  /**
   * 여행 정보 ID, 사용자 이메일 기준 사용자 여부 조회
   * @param travelId
   * @param userEmail
   * 
   * @return boolean
   */
  @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM TravelInfo t WHERE t.id = :travelId AND t.user.email = :userEmail")
  boolean isUser(@Param("travelId") String travelId, @Param("userEmail") String userEmail);
}
