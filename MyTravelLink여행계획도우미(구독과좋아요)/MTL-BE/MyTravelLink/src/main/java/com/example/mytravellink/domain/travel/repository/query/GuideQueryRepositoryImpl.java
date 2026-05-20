package com.example.mytravellink.domain.travel.repository.query;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.mytravellink.domain.travel.entity.Guide;
import com.example.mytravellink.domain.travel.entity.QGuide;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class GuideQueryRepositoryImpl implements GuideQueryRepository {
  
  private final JPAQueryFactory queryFactory;

  private final QGuide guide = QGuide.guide;

  @Override
  public List<Guide> findAllByTravelInfoId(String travelInfoId) {
    return queryFactory.selectFrom(guide)
      .where(guide.travelInfo.id.eq(travelInfoId))
      .fetch();
  }

  @Override
  public boolean isUser(String guideId, String userEmail) {
    return queryFactory.selectFrom(guide)
      .where(guide.travelInfo.id.eq(guideId)
        .and(guide.travelInfo.user.email.eq(userEmail)))
      .fetchFirst() != null;
  }
}
