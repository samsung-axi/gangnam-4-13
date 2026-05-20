package com.bask_eat.business_backend.model.dto.request

import jakarta.validation.constraints.NotBlank

data class GoogleTokenRequest(
  @field:NotBlank(message = "ID 토큰은 필수입니다")
  val idToken: String
)
