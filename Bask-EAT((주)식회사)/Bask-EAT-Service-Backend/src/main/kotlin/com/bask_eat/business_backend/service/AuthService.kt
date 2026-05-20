package com.bask_eat.business_backend.service

import com.bask_eat.business_backend.model.entity.User
import com.bask_eat.business_backend.security.JwtTokenProvider
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.FirebaseToken
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class AuthService(
  private val firebaseAuth: FirebaseAuth,
  private val jwtTokenProvider: JwtTokenProvider
) {

  fun verifyGoogleToken(idToken: String): FirebaseToken {
    return try {
      firebaseAuth.verifyIdToken(idToken)
    } catch (e: FirebaseAuthException) {
      logger.error("Firebase ID Token 검증 실패", e)
      throw RuntimeException("유효하지 않은 토큰입니다", e)
    }
  }

  fun generateJwtToken(user: User): String {
    return jwtTokenProvider.generateToken(user)
  }

  suspend fun refreshAccessToken(refreshToken: String, userId: String): String {
    // TODO: Refresh token 검증 로직 구현
    // 현재는 단순히 새 토큰 생성
    return jwtTokenProvider.generateTokenFromUserId(userId)
  }

  suspend fun logout(userId: String) {
    // TODO: 토큰 블랙리스트 처리 또는 리프레시 토큰 무효화
    logger.info("사용자 로그아웃: $userId")
  }

  companion object {
    private val logger = LoggerFactory.getLogger(AuthService::class.java)
  }
}
