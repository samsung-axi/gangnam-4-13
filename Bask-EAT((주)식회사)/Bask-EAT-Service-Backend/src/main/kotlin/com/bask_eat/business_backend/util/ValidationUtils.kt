package com.bask_eat.business_backend.util

object ValidationUtils {

  fun isValidEmail(email: String): Boolean {
    val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    return email.matches(emailRegex.toRegex())
  }

  fun isValidUserId(userId: String): Boolean {
    return userId.isNotBlank() && userId.length <= 128
  }

  fun isValidMessage(message: String): Boolean {
    return message.isNotBlank() && message.length <= 4000
  }

  fun sanitizeString(input: String): String {
    return input.trim().replace(Regex("\\s+"), " ")
  }
}
