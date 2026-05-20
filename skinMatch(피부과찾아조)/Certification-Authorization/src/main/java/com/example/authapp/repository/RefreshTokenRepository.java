package com.example.authapp.repository;

import com.example.authapp.entity.RefreshToken;
import com.example.authapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // 토큰으로 RefreshToken 조회
    Optional<RefreshToken> findByToken(String token);

    // 사용자로 RefreshToken 조회
    Optional<RefreshToken> findByUser(User user);

    // 사용자 ID로 RefreshToken 조회
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.id = :userId")
    Optional<RefreshToken> findByUserId(@Param("userId") Long userId);

    // 특정 사용자의 RefreshToken 삭제
    void deleteByUser(User user);

    // 사용자 ID로 RefreshToken 삭제
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    // 만료된 토큰들 삭제 (배치 작업용)
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    // 만료된 토큰 개수 조회
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.expiresAt < :now")
    long countExpiredTokens(@Param("now") LocalDateTime now);

    // 사용자가 RefreshToken을 가지고 있는지 확인
    boolean existsByUser(User user);

    // 토큰 존재 여부 확인
    boolean existsByToken(String token);
}