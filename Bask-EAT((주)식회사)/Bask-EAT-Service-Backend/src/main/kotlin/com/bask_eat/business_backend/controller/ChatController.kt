package com.bask_eat.business_backend.controller

import com.bask_eat.business_backend.exception.ChatException
import com.bask_eat.business_backend.exception.LlmException
import com.bask_eat.business_backend.model.dto.request.ChatRequest
import com.bask_eat.business_backend.model.dto.response.ChatResponse
import com.bask_eat.business_backend.model.dto.response.ChatResult
import com.bask_eat.business_backend.model.dto.response.ConversationSummary
import com.bask_eat.business_backend.service.ChatService
import com.bask_eat.business_backend.service.LlmService
import jakarta.validation.Valid
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asContextElement
import kotlinx.coroutines.withContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@Validated
class ChatController(
  private val chatService: ChatService,
  private val llmService: LlmService
) {

  @PostMapping("/chat")
  suspend fun chat(
    @Valid @RequestBody chatRequest: ChatRequest,
    authentication: Authentication
  ): ResponseEntity<ChatResponse> {
    // SecurityContext를 담은 ThreadLocal 생성
    val securityThreadLocal = ThreadLocal<SecurityContext?>().apply {
      set(SecurityContextHolder.getContext())
    }
    // ThreadLocal.asContextElement()로 코루틴에 전파
    return withContext(Dispatchers.IO + securityThreadLocal.asContextElement()) {
      try {
        val userId = authentication.name
        val chat = chatService.findOrCreateChat(chatRequest.chatId, userId)
        val combined = chatService.combineMessages(userId, chat, chatRequest.message)
        val jobId = llmService.sendChatRequest(combined)
        val rawResult = llmService.pollJobStatus(jobId)
        chatService.saveMessage(userId, chat.id, chatRequest.message, rawResult)

        // 수정: status 및 result 포함하여 응답 생성
        ResponseEntity.ok(
          ChatResponse(
            status = "completed",
            result = rawResult
          )
        )
      } catch (ex: ChatException) {
        ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(
            ChatResponse(
              status = "failed",
              result = ChatResult(answer = ex.message ?: "CHAT_ERROR", chatType = "error"),
            )
          )
      } catch (ex: LlmException) {
        ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
          .body(
            ChatResponse(
              status = "failed",
              result = ChatResult(answer = ex.message ?: "LLM_ERROR", chatType = "error")
            )
          )
      } catch (ex: Exception) {
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
            ChatResponse(
              status = "error",
              result = ChatResult(answer = ex.message ?: "INTERNAL_ERROR", chatType = "error")
            )
          )
      }
    }
  }

  // 사용자 채팅 목록 조회
  @GetMapping("/users/me/chats")
  suspend fun getUserChats(authentication: Authentication): ResponseEntity<List<ConversationSummary>> {
    val userId = authentication.name
    return ResponseEntity.ok(chatService.getUserChats(userId))
  }

  // 사용자 채팅 상세 조회
  @GetMapping("/users/me/chats/{chatId}")
  suspend fun getChat(
    @PathVariable chatId: String,
    authentication: Authentication
  ): ResponseEntity<Any> {
    val userId = authentication.name
    return ResponseEntity.ok(chatService.getChatWithMessages(userId, chatId))
  }


  @DeleteMapping("/users/me/chats/{chatId}")
  suspend fun deleteChat(
    @PathVariable chatId: String,
    authentication: Authentication
  ): ResponseEntity<Map<String, String>> {
    val userId = authentication.name
    chatService.deleteChat(userId, chatId)
    return ResponseEntity.ok(mapOf("message" to "채팅방이 삭제되었습니다."))
  }
}
