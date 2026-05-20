package com.example.backend.controller

import com.example.backend.service.AuthService
import com.example.backend.service.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(AuthController::class)
class AuthControllerTest {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @MockBean
  private lateinit var authService: AuthService

  @MockBean
  private lateinit var userService: UserService

  @Test
  @WithMockUser
  fun `Google 로그인 API 테스트`() {
    val requestBody = mapOf("idToken" to "test-token")

    mockMvc.perform(
      post("/api/auth/google")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(requestBody))
    )
      .andExpect(status().isOk)
  }
}
