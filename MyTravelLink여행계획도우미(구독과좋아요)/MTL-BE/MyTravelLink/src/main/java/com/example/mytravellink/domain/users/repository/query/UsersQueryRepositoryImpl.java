package com.example.mytravellink.domain.users.repository.query;

import com.example.mytravellink.domain.users.entity.QUsers;
import com.example.mytravellink.domain.users.entity.Users;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@RequiredArgsConstructor
@Repository
public class UsersQueryRepositoryImpl implements UsersQueryRepository {
  
  private final JPAQueryFactory queryFactory;
  private static final QUsers qUsers = QUsers.users;

  @Override
  public List<Users> findByDelete(Boolean delete) {
    return queryFactory.selectFrom(qUsers)
      .where(qUsers.isDelete.eq(delete))
      .fetch();
  }
}
