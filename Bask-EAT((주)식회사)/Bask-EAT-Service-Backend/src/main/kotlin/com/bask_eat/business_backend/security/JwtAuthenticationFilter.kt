package com.bask_eat.business_backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
  private val jwtTokenProvider: JwtTokenProvider
) : OncePerRequestFilter() {

  override fun shouldNotFilterAsyncDispatch(): Boolean = false
  override fun shouldNotFilterErrorDispatch(): Boolean = false

  override fun doFilterInternal(
    request: HttpServletRequest,
    response: HttpServletResponse,
    filterChain: FilterChain
  ) {
    val requestUri = request.requestURI
    val authHeader = request.getHeader("Authorization")
    logger.debug("[JwtAuthFilter] uri=" + requestUri + ", hasAuthHeader=" + (authHeader != null))

    val token = extractToken(request)

    if (token != null && !token.startsWith("firebase-") && jwtTokenProvider.validateToken(token)) {
      try {
        val userId = jwtTokenProvider.getUserIdFromToken(token)
        SecurityContextHolder.getContext().authentication =
          UsernamePasswordAuthenticationToken(userId, null, emptyList())
      } catch (e: Exception) {
        logger.warn("JWT token 처리 중 오류 발생", e)
      }
    } else {
      if (token != null && !token.startsWith("firebase-")) {
        logger.debug("[JwtAuthFilter] token present but invalid (validate=false)")
      }
    }
    // 필터 체인은 무조건 한 번만 호출
    filterChain.doFilter(request, response)
  }


  private fun extractToken(request: HttpServletRequest): String? {
    val bearerToken = request.getHeader("Authorization")
    return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      bearerToken.substring(7)
    } else null
  }

  companion object {
    private val log = LoggerFactory.getLogger(JwtAuthenticationFilter::class.java)
  }
}
