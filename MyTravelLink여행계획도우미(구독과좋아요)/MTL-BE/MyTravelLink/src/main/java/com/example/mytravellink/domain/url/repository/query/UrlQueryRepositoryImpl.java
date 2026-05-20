package com.example.mytravellink.domain.url.repository.query;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.mytravellink.domain.url.entity.QUrl;
import com.example.mytravellink.domain.url.entity.Url;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Repository
public class UrlQueryRepositoryImpl implements UrlQueryRepository {
  
  private final JPAQueryFactory queryFactory;
  private final QUrl url = new QUrl("url");

  @Override
  public List<Url> findAllByEmailId(String emailId) {
    return queryFactory.selectFrom(url)
      .join(url.usersUrls)
      .where(url.usersUrls.any().user.email.eq(emailId))
      .fetch();
  }
}
