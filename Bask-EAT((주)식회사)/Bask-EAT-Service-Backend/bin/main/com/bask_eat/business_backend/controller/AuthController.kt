package com.bask_eat.business_backend.controller


import com.bask_eat.business_backend.model.dto.request.GoogleTokenRequest
import com.bask_eat.business_backend.model.dto.request.RefreshTokenRequest
import com.bask_eat.business_backend.model.dto.response.AuthResponse
import com.bask_eat.business_backend.model.dto.response.UserDto
import com.bask_eat.business_backend.service.AuthService
import com.bask_eat.business_backend.service.UserService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(value = ["/api/auth", "/fh/api/auth"]) 
@Validated
class AuthController(
  private val authService: AuthService,
  private val userService: UserService
) {

  @PostMapping("/google")
  suspend fun googleLogin(
    @RequestHeader(name = "Authorization", required = false) authHeader: String?,
    @RequestBody(required = false) body: Map<String, Any>?
  ): ResponseEntity<AuthResponse> {
    return try {
      // Firebase ID Token 추출 (우선순위: Authorization 헤더 > 요청 바디)
      val idToken = when {
        authHeader != null && authHeader.startsWith("Bearer ") -> authHeader.substring(7)
        (body?.get("idToken") as? String)?.isNotBlank() == true -> body?.get("idToken") as String
        else -> throw IllegalArgumentException("idToken 이 제공되지 않았습니다")
      }

      // Firebase ID Token 검증
      // val decodedToken = authService.verifyGoogleToken(tokenRequest.idToken)
      val decodedToken = authService.verifyGoogleToken(idToken)

      // 사용자 정보 조회 또는 생성
      val user = userService.findOrCreateUser(decodedToken)

      // JWT 토큰 생성
      val jwtToken = authService.generateJwtToken(user)

      val authResponse = AuthResponse(
        accessToken = jwtToken,
        tokenType = "Bearer",
        expiresIn = 86400, // 24 hours
        user = UserDto(
          id = user.id,
          email = user.email,
          name = user.name,
          profileImageUrl = user.profileImageUrl
        )
      )

      val response = ResponseEntity.ok()
        .header("Authorization", "Bearer $jwtToken")
        .header("X-Access-Token", jwtToken)
        .body(authResponse)

      response
    } catch (e: Exception) {
      logger.error("Google 로그인 처리 중 오류 발생", e)
      ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(AuthResponse.error("로그인에 실패했습니다."))
    }
  }

  @PostMapping("/refresh")
  suspend fun refreshToken(
    @Valid @RequestBody refreshRequest: RefreshTokenRequest,
    authentication: Authentication
  ): ResponseEntity<AuthResponse> {
    return try {
      val userId = authentication.name
      val newAccessToken = authService.refreshAccessToken(refreshRequest.refreshToken, userId)

      val authResponse = AuthResponse(
        accessToken = newAccessToken,
        tokenType = "Bearer",
        expiresIn = 86400000
      )

      ResponseEntity.ok(authResponse)
    } catch (e: Exception) {
      logger.error("토큰 갱신 중 오류 발생", e)
      ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(AuthResponse.error("토큰 갱신에 실패했습니다."))
    }
  }

  @PostMapping("/logout")
  suspend fun logout(authentication: Authentication): ResponseEntity<Map<String, String>> {
    return try {
      val userId = authentication.name
      authService.logout(userId)

      ResponseEntity.ok(mapOf("message" to "로그아웃되었습니다."))
    } catch (e: Exception) {
      logger.error("로그아웃 처리 중 오류 발생", e)
      ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(mapOf("error" to "로그아웃 처리에 실패했습니다."))
    }
  }

  @GetMapping("/me")
  suspend fun getCurrentUser(authentication: Authentication): ResponseEntity<UserDto> {
    return try {
      val userId = authentication.name
      val user = userService.findById(userId)
        ?: return ResponseEntity.notFound().build()

      val userDto = UserDto(
        id = user.id,
        email = user.email,
        name = user.name,
        profileImageUrl = user.profileImageUrl
      )

      ResponseEntity.ok(userDto)
    } catch (e: Exception) {
      logger.error("사용자 정보 조회 중 오류 발생", e)
      return if (authentication == null) {
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
      } else {
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
      }
    }
  }

  companion object {
    private val logger = LoggerFactory.getLogger(AuthController::class.java)
  }
}
