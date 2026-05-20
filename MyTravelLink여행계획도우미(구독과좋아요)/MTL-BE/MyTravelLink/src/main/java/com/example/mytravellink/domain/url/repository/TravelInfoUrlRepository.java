package com.example.mytravellink.domain.url.repository;

import java.util.List;

import com.example.mytravellink.domain.url.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mytravellink.domain.travel.entity.TravelInfo;
import com.example.mytravellink.domain.travel.entity.TravelInfoUrl;
import com.example.mytravellink.domain.travel.entity.TravelInfoUrlId;

@Repository
public interface TravelInfoUrlRepository extends JpaRepository<TravelInfoUrl, TravelInfoUrlId> {

  // TravelInfo에 해당하는 Url ID 목록 조회
  @Query("SELECT tu.url.id FROM TravelInfoUrl tu WHERE tu.travelInfo = :travelInfo")
  List<String> findUrlIdByTravelInfoId(@Param("travelInfo") TravelInfo travelInfo);

  @Query("SELECT tu.url.id FROM TravelInfoUrl tu WHERE tu.travelInfo.id = :travelInfoId")
  List<String> findUrlIdByTravelInfoId(@Param("travelInfoId") String travelInfoId);

  // 새롭게 추가: 해당 URL ID가 travel_info_url 테이블에 존재하는지 여부를 반환
  @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM TravelInfoUrl t WHERE t.url.id = :urlId")
  boolean existsByUrlId(@Param("urlId") String urlId);

}
