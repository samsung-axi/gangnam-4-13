package com.bask_eat.business_backend.model.dto.response

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AuthResponse(
  val accessToken: String? = null,
  val tokenType: String? = null,
  val expiresIn: Long? = null,
  val refreshToken: String? = null,
  val user: UserDto? = null,
  val error: String? = null,
  val message: String? = null
) {
  companion object {
    fun error(message: String) = AuthResponse(error = "AUTHENTICATION_FAILED", message = message)
  }
}