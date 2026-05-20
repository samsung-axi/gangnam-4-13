package com.bask_eat.business_backend.model.entity

import com.bask_eat.business_backend.model.enums.UserRole
import java.util.*

data class User(
  val id: String = "",
  val email: String = "",
  val name: String = "",
  val profileImageUrl: String? = null,
  val provider: String = "google",
  val providerId: String = "",
  val role: UserRole = UserRole.USER,
  val createdAt: Date = Date(),
  val updatedAt: Date = Date(),
  val isActive: Boolean = true,

  val chatList: List<String> = emptyList(), // 채팅 UUID 리스트
  val recipeList: List<String> = emptyList() // 레시피 ID 리스트
) {
  companion object {
    const val COLLECTION_NAME = "users"
  }
}
