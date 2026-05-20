package com.example.authapp.service;

import com.example.authapp.entity.RefreshToken;
import com.example.authapp.entity.User;
import com.example.authapp.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    // RefreshToken 생성 및 저장
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // 기존 RefreshToken이 있다면 삭제
        refreshTokenRepository.deleteByUser(user);

        // 새 RefreshToken 생성
        String refreshTokenValue = jwtService.generateRefreshToken(user);
        LocalDateTime expiryDate = jwtService.calculateRefreshTokenExpiryDate();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .user(user)
                .expiresAt(expiryDate)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Created refresh token for user: {}", user.getEmail());

        return savedToken;
    }

    // RefreshToken 조회
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // RefreshToken 유효성 검증
    public boolean validateRefreshToken(String token) {
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepository.findByToken(token);

        if (refreshTokenOpt.isEmpty()) {
            log.warn("Refresh token not found in database: {}", token);
            return false;
        }

        RefreshToken refreshToken = refreshTokenOpt.get();

        if (refreshToken.isExpired()) {
            log.warn("Refresh token is expired for user: {}", refreshToken.getUser().getEmail());
            deleteRefreshToken(refreshToken);
            return false;
        }

        return true;
    }

    // RefreshToken으로 새로운 AccessToken 생성
    @Transactional
    public String refreshAccessToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 Refresh Token입니다."));

        if (refreshToken.isExpired()) {
            deleteRefreshToken(refreshToken);
            throw new RuntimeException("만료된 Refresh Token입니다.");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtService.generateAccessToken(user);

        log.info("Refreshed access token for user: {}", user.getEmail());
        return newAccessToken;
    }

    // RefreshToken 업데이트
    @Transactional
    public RefreshToken updateRefreshToken(User user, String newRefreshToken) {
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);

        if (existingToken.isPresent()) {
            RefreshToken refreshToken = existingToken.get();
            LocalDateTime newExpiryDate = jwtService.calculateRefreshTokenExpiryDate();
            refreshToken.updateToken(newRefreshToken, newExpiryDate);

            log.info("Updated refresh token for user: {}", user.getEmail());
            return refreshTokenRepository.save(refreshToken);
        } else {
            // 기존 토큰이 없으면 새로 생성
            return createRefreshToken(user);
        }
    }

    // RefreshToken 삭제
    @Transactional
    public void deleteRefreshToken(RefreshToken refreshToken) {
        refreshTokenRepository.delete(refreshToken);
        log.info("Deleted refresh token for user: {}", refreshToken.getUser().getEmail());
    }

    // 사용자의 RefreshToken 삭제 (로그아웃 시)
    @Transactional
    public void deleteRefreshTokenByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
        log.info("Deleted refresh token for user: {}", user.getEmail());
    }

    // 만료된 RefreshToken들 일괄 삭제 (배치 작업용)
    @Transactional
    public void deleteExpiredTokens() {
        long deletedCount = refreshTokenRepository.countExpiredTokens(LocalDateTime.now());
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Deleted {} expired refresh tokens", deletedCount);
    }
}