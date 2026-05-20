package com.example.mytravellink.domain.travel.repository;

import com.example.mytravellink.domain.travel.entity.TravelInfoPlace;
import com.example.mytravellink.domain.travel.entity.TravelInfoPlaceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelInfoPlaceRepository extends JpaRepository<TravelInfoPlace, TravelInfoPlaceId> {
    
    @Query("SELECT DISTINCT p.id FROM TravelInfoPlace tip " +
           "INNER JOIN tip.travelInfo t " +
           "LEFT JOIN tip.place p " +
           "WHERE t.id = :travelInfoId " +
           "AND t.isDelete = false " +
           "AND p.id IS NOT NULL")
    List<String> findByTravelInfoId(@Param("travelInfoId") String travelInfoId);

    @Query("SELECT COUNT(tip) FROM TravelInfoPlace tip " +
           "INNER JOIN tip.travelInfo t " +
           "WHERE t.id = :travelInfoId " +
           "AND t.isDelete = false")
    int getPlaceCnt(@Param("travelInfoId") String travelInfoId);
}