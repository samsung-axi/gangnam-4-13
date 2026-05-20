package com.example.mytravellink.domain.travel.service;

import java.util.List;

import com.example.mytravellink.domain.travel.entity.Place;
import com.example.mytravellink.domain.travel.entity.TravelInfo;

public interface TravelInfoService {

  TravelInfo getTravelInfo(String travelId);

  List<Place> getTravelInfoPlace(String travelInfoId);

  void updateTravelInfo(String travelInfoId, String travelInfoTitle, Integer travelDays);

  List<TravelInfo> getTravelInfoList(String userEmail);

  void updateFavorite(String travelInfoId, Boolean isFavorite);

  void updateFixed(String travelInfoId, Boolean fixed);

  void deleteTravelInfo(String travelInfoId);

  int getGuideCount(String userEmail);

  boolean isUser(String travelId, String userEmail);
}
