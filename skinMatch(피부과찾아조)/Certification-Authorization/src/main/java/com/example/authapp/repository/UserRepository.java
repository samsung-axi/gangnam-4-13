package com.example.authapp.repository;

import com.example.authapp.entity.Provider;
import com.example.authapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // 이메일로 사용자 조회
    Optional<User> findByEmail(String email);

    // 제공자와 제공자 ID로 사용자 조회 (OAuth 로그인 시 사용)
    Optional<User> findByProviderAndProviderId(Provider provider, String providerId);

    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);

    // 제공자와 제공자 ID 존재 여부 확인
    boolean existsByProviderAndProviderId(Provider provider, String providerId);

    // 특정 제공자로 가입한 사용자들 조회
    @Query("SELECT u FROM User u WHERE u.provider = :provider")
    java.util.List<User> findAllByProvider(@Param("provider") Provider provider);

    // 이메일과 제공자로 사용자 조회 (동일 이메일, 다른 제공자 처리용)
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.provider = :provider")
    Optional<User> findByEmailAndProvider(@Param("email") String email, @Param("provider") Provider provider);

    // === 관리자 기능을 위한 메서드들 ===
    
    // 활성 사용자 수 조회 (계정 상태)
    Long countByActiveTrue();
    
    // 비활성 사용자 수 조회 (계정 상태)
    Long countByActiveFalse();
    
    // 온라인 사용자 수 조회 (접속 상태)
    Long countByOnlineTrue();
    
    // 최근 활동 사용자 수 조회 (5분 이내)
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLoginAt >= :since")
    Long countRecentlyActiveUsers(@Param("since") LocalDateTime since);
    
    // 특정 기간 내 가입한 사용자 수 조회
    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // 사용자명으로 조회
    Optional<User> findByUsername(String username);
    
    // 사용자명 존재 여부 확인
    boolean existsByUsername(String username);
}
