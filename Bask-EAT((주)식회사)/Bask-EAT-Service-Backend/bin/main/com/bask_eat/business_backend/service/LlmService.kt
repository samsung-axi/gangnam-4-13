package com.bask_eat.business_backend.service


import com.bask_eat.business_backend.exception.LlmException
import com.bask_eat.business_backend.model.entity.Message
import com.bask_eat.business_backend.model.enums.JobStatus
import com.fasterxml.jackson.annotation.JsonProperty
import kotlinx.coroutines.delay
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.reactive.function.client.awaitExchange

@Service
class LlmService(
  private val webClient: WebClient,
  @Value("\${llm.module.polling.interval}") private val pollingInterval: Long,
  @Value("\${llm.module.polling.max-attempts}") private val maxAttempts: Int
) {

  suspend fun sendChatRequest(messages: List<Message>): String {
    val historyContents = messages.map { it.content }
    val latest = historyContents.last()  // 혹은 chatRequest.message
    val request = LlmChatRequest(
      message = latest,
      chatHistory = historyContents.dropLast(1)  // 최신 메시지 제외한 과거 기록
    )

    val entity = webClient.post()
      .uri("/chat")
      .contentType(MediaType.APPLICATION_JSON)
      .bodyValue(request)
      .awaitExchange { response ->
        when (response.statusCode().value()) {
          202 -> response.awaitBody<IntermediateResponse>()
          else -> throw RuntimeException("LLM 요청 실패: ${response.statusCode()}")
        }
      }

    return entity.jobId ?: throw RuntimeException("jobId 누락")
  }

  suspend fun pollJobStatus(jobId: String): String {
    repeat(maxAttempts) { attempt ->
      val status = getJobStatus(jobId)

      when (status.status) {
        JobStatus.completed -> return status.result ?: "응답을 가져오는데 실패했습니다."
        JobStatus.failed -> throw LlmException("LLM 처리가 실패했습니다: ${status.error}")
        JobStatus.processing, JobStatus.pending -> {
          logger.info("Job $jobId 처리 중... (${attempt + 1}/$maxAttempts)")
          delay(pollingInterval)
        }
      }
    }

    throw LlmException("LLM 응답 시간이 초과되었습니다. Job ID: $jobId")
  }

  private suspend fun getJobStatus(jobId: String): LlmStatusResponse {
    return webClient.get()
      .uri("/status/$jobId")
      .retrieve()
      .awaitBody<LlmStatusResponse>()
  }

  companion object {
    private val logger = LoggerFactory.getLogger(LlmService::class.java)
  }
}

data class LlmChatRequest(
  val message: String,
  val chatHistory: List<String>? = null
)

data class LlmChatResponse(
  val jobId: String
)

data class LlmStatusResponse(
  val status: JobStatus,
  val result: String?,
  val error: String?
)

data class IntermediateResponse(
  @JsonProperty("job_id")
  val jobId: String?
)