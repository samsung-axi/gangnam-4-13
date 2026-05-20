package com.bask_eat.business_backend.model.dto.response


import java.util.*

data class ConversationSummary(
  val id: String,
  val title: String,
  val lastMessage: String,
  val updatedAt: Date
)
