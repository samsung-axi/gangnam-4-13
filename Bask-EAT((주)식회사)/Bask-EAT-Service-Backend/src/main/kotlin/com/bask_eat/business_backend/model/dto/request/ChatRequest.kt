package com.bask_eat.business_backend.model.dto.request

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ChatRequest(
  @field:JsonProperty("chat_id")
  val chatId: String?, // null이면 새로운 대화 생성

  @field:NotBlank(message = "메시지는 비어있을 수 없습니다")
  @field:Size(max = 4000, message = "메시지는 4000자를 초과할 수 없습니다")
  val message: String,

  @field:JsonProperty("image")
  val imgae: String? = null,
)
