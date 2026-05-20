package com.bask_eat.business_backend.exception

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import java.util.*

@RestControllerAdvice
class GlobalExceptionHandler {

  @ExceptionHandler(AuthenticationException::class)
  fun handleAuthenticationException(
    ex: AuthenticationException,
    request: WebRequest
  ): ResponseEntity<ErrorResponse> {
    logger.error("Authentication error", ex)

    val errorResponse = ErrorResponse(
      error = "AUTHENTICATION_ERROR",
      message = ex.message ?: "인증 오류가 발생했습니다",
      timestamp = Date(),
      path = request.getDescription(false)
    )

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse)
  }

  @ExceptionHandler(ChatException::class)
  fun handleChatException(
    ex: ChatException,
    request: WebRequest
  ): ResponseEntity<ErrorResponse> {
    logger.error("Chat error", ex)

    val errorResponse = ErrorResponse(
      error = "CHAT_ERROR",
      message = ex.message ?: "채팅 처리 중 오류가 발생했습니다",
      timestamp = Date(),
      path = request.getDescription(false)
    )

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
  }

  @ExceptionHandler(LlmException::class)
  fun handleLlmException(
    ex: LlmException,
    request: WebRequest
  ): ResponseEntity<ErrorResponse> {
    logger.error("LLM error", ex)

    val errorResponse = ErrorResponse(
      error = "LLM_ERROR",
      message = ex.message ?: "LLM 서비스 오류가 발생했습니다",
      timestamp = Date(),
      path = request.getDescription(false)
    )

    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse)
  }

  @ExceptionHandler(MethodArgumentNotValidException::class)
  fun handleValidationExceptions(
    ex: MethodArgumentNotValidException,
    request: WebRequest
  ): ResponseEntity<ErrorResponse> {
    val errorMessage = ex.bindingResult.fieldErrors
      .map { "${it.field}: ${it.defaultMessage}" }
      .joinToString(", ")

    val errorResponse = ErrorResponse(
      error = "VALIDATION_ERROR",
      message = errorMessage,
      timestamp = Date(),
      path = request.getDescription(false)
    )

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
  }

  @ExceptionHandler(Exception::class)
  fun handleGeneralException(
    ex: Exception,
    request: WebRequest
  ): ResponseEntity<ErrorResponse> {
    logger.error("Unexpected error", ex)

    val errorResponse = ErrorResponse(
      error = "INTERNAL_SERVER_ERROR",
      message = "서버 내부 오류가 발생했습니다",
      timestamp = Date(),
      path = request.getDescription(false)
    )

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
  }

  companion object {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)
  }
}

data class ErrorResponse(
  val error: String,
  val message: String,
  val timestamp: Date,
  val path: String
)
