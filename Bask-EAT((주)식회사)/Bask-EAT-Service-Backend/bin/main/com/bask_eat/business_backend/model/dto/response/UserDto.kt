package com.bask_eat.business_backend.model.dto.response

data class UserDto(
  val id: String,
  val email: String,
  val name: String,
  val profileImageUrl: String?
)
