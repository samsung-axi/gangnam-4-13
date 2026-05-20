package com.bask_eat.business_backend.security

import com.bask_eat.business_backend.config.JwtConfig
import com.bask_eat.business_backend.model.entity.User
import com.bask_eat.business_backend.service.UserService
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.io.Decoders
import org.springframework.stereotype.Component
import java.util.*

@Component
class JwtTokenProvider(
  private val jwtConfig: JwtConfig,
  private val userService: UserService
) {

  // Use Base64-decoded key material for HMAC signing/verification
  private val secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtConfig.secret))

  fun generateToken(user: User): String {
    val now = Date()
    val expiryDate = Date(now.time + jwtConfig.expiration)

    return Jwts.builder()
      .setSubject(user.id)
      .claim("email", user.email)
      .claim("name", user.name)
      .claim("role", user.role.name)
      .setIssuedAt(now)
      .setExpiration(expiryDate)
      .signWith(secretKey, SignatureAlgorithm.HS512)
      .compact()
  }

  suspend fun generateTokenFromUserId(userId: String): String {
    val user = userService.findById(userId)
      ?: throw RuntimeException("사용자를 찾을 수 없습니다: $userId")
    return generateToken(user)
  }

  fun getUserIdFromToken(token: String): String {
    val claims = getClaimsFromToken(token)
    return claims.subject
  }

  fun validateToken(token: String): Boolean {
    return try {
      val claims = getClaimsFromToken(token)
      !claims.expiration.before(Date())
    } catch (e: Exception) {
      false
    }
  }

  private fun getClaimsFromToken(token: String): Claims {
    // jjwt 0.12.x: verifyWith(...) + parseSignedClaims(...).payload
    return Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token)
      .payload
  }
}
