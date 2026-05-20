package com.bask_eat.business_backend.model.dto.response

import com.bask_eat.business_backend.model.entity.Recipe
import java.util.*

data class ChatResponse(
  val status: String,
  val result: ChatResult
)

data class ChatResult(
  val chatType: String,
  val answer: String,
  val recipes: List<Recipe>? = null,
  val chatId: String? = null,
  val jobId: String? = null,
  val timestamp: Date? = null
)