package com.example.mytravellink.domain.url.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserUrlRepository {

    @Modifying
    @Transactional
    @Query("UPDATE UsersUrl u SET u.use = :isUse WHERE u.email = :email AND u.url.id = :urlId")
    int updateIsUseByEmailAndUrlId(@Param("email") String email, @Param("urlId") String urlId, @Param("isUse") boolean isUse);
} 