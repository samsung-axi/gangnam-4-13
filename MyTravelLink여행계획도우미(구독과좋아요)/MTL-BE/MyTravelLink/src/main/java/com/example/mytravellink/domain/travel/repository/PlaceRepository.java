package com.example.mytravellink.domain.travel.repository;

import java.util.List;
import java.util.Optional;

import com.example.mytravellink.api.travelInfo.dto.travel.AIPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mytravellink.domain.travel.entity.Place;

public interface PlaceRepository extends JpaRepository<Place, String> {

  Optional<Place> findById(String placeId);

  @Query("SELECT p FROM Place p WHERE p.id IN :ids")
  List<Place> findByIds(@Param("ids") List<String> ids);

  @Query("SELECT p FROM Place p WHERE p.id IN :ids")
  List<AIPlace> findByPlaceIds(@Param("ids") List<AIPlace> ids);
  
  Optional<Place> findByTitle(String title);
}

