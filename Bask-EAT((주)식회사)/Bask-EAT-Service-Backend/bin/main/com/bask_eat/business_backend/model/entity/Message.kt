package com.bask_eat.business_backend.model.entity

import java.util.*

data class Message(
  val role: String = "",         // "user" 또는 "assistant"
  val content: String = "",
  val timestamp: Date = Date()
) {
  companion object {
    const val COLLECTION_NAME = "messages"
  }
}
