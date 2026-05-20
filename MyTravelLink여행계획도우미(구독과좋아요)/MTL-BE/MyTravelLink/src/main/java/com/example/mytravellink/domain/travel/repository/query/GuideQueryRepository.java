package com.example.mytravellink.domain.travel.repository.query;

import java.util.List;

import com.example.mytravellink.domain.travel.entity.Guide;

public interface GuideQueryRepository  {
  public List<Guide> findAllByTravelInfoId(String travelInfoId);

  public boolean isUser(String guideId, String userEmail);
}
