package com.bask_eat.business_backend.model.dto.response

import com.fasterxml.jackson.annotation.JsonProperty
import java.util.*

data class ChatResponse(
  @JsonProperty("chat_id")
  val chatId: String,
  val message: String,
  @JsonProperty("job_id")
  val jobId: String,
  val timestamp: Date
)