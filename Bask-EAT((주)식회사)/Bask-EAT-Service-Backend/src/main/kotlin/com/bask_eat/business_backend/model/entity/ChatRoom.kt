package com.bask_eat.business_backend.model.entity

import java.util.*

data class ChatRoom(
  val id: String = "",
  val userId: String = "",
  val title: String = "",
  val active: Boolean = true,
  val createdAt: Date = Date(),
  val updatedAt: Date = Date()
) {
  companion object {
    const val COLLECTION_NAME = "chats"
  }
}
