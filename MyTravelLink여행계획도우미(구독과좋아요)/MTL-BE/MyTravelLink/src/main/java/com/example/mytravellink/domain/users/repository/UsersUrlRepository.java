package com.example.mytravellink.domain.users.repository;

import com.example.mytravellink.api.user.dto.LinkDataResponse;
import com.example.mytravellink.domain.users.entity.UsersUrl;
import com.example.mytravellink.domain.users.entity.UsersUrlId;
import com.example.mytravellink.domain.url.entity.Url;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersUrlRepository extends JpaRepository<UsersUrl, UsersUrlId> {

    @Query("SELECT new com.example.mytravellink.api.user.dto.LinkDataResponse(u.id, u.urlTitle, u.url, u.updateAt) " +
           "FROM UsersUrl uu JOIN uu.url u " +
           "WHERE uu.user.email = :email AND uu.isUse = true " +
           "ORDER BY u.updateAt DESC")
    List<LinkDataResponse> findTopActiveLinks(@Param("email") String email, Pageable pageable);

    List<UsersUrl> findAllByUrl(Url url);
    
  // URL ID와 사용자 이메일이 Url 테이블에 존재하는지 여부를 반환
  @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UsersUrl u WHERE u.url.id = :urlId AND u.user.email = :userEmail")
  boolean existsByIdAndUserEmail(@Param("urlId") String urlId, @Param("userEmail") String userEmail);
}