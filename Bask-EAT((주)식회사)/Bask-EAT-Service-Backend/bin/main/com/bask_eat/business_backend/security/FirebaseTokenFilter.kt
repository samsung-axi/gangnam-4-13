package com.bask_eat.business_backend.security

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class FirebaseTokenFilter(
  private val firebaseAuth: FirebaseAuth
) : OncePerRequestFilter() {

  override fun doFilterInternal(
    request: HttpServletRequest,
    response: HttpServletResponse,
    filterChain: FilterChain
  ) {
    val token = extractToken(request)
    if (token != null && token.startsWith("firebase-")) {
      try {
        val firebaseToken = firebaseAuth.verifyIdToken(token.removePrefix("firebase-"))
        SecurityContextHolder.getContext().authentication =
          UsernamePasswordAuthenticationToken(firebaseToken.uid, null, emptyList())
      } catch (e: FirebaseAuthException) {
        log.warn("Firebase token 검증 실패", e)
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
    private val log = LoggerFactory.getLogger(FirebaseTokenFilter::class.java)
  }
}
