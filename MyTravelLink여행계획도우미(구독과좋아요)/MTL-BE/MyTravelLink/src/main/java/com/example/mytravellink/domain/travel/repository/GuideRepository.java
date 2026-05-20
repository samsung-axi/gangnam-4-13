package com.example.mytravellink.domain.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.mytravellink.domain.travel.entity.Guide;
import com.example.mytravellink.domain.travel.repository.query.GuideQueryRepository;

public interface GuideRepository extends JpaRepository<Guide, String>, GuideQueryRepository {
  

  @Query("SELECT g FROM Guide g WHERE g.travelInfo.id IN :travelInfoIdList AND g.isDelete = false")
  List<Guide> findByTravelInfoIdList(@Param("travelInfoIdList") List<String> travelInfoIdList);

  @Transactional
  @Modifying
  @Query("UPDATE Guide g SET g.isFavorite = :isFavorite WHERE g.id = :guideId AND g.isDelete = false")
  void updateGuideBookFavorite(@Param("guideId") String guideId, @Param("isFavorite") boolean isFavorite);

  @Transactional
  @Modifying
  @Query("UPDATE Guide g SET g.fixed = :isFixed WHERE g.id = :guideId")
  void updateGuideBookFixed(@Param("guideId") String guideId, @Param("isFixed") boolean isFixed);

  @Transactional
  @Modifying
  @Query("UPDATE Guide g SET g.isDelete = true WHERE g.id = :guideId")
  void updateGuideBookDelete(@Param("guideId") String guideId);
}
