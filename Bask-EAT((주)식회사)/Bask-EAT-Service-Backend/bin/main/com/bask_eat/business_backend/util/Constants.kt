package com.bask_eat.business_backend.util

object Constants {
  const val JWT_HEADER = "Authorization"
  const val JWT_PREFIX = "Bearer "

  object Collections {
    const val USERS = "users"
    const val CONVERSATIONS = "conversations"
    const val MESSAGES = "messages"
  }

  object Messages {
    const val UNAUTHORIZED = "인증이 필요합니다"
    const val ACCESS_DENIED = "접근 권한이 없습니다"
    const val INVALID_TOKEN = "유효하지 않은 토큰입니다"
    const val TOKEN_EXPIRED = "토큰이 만료되었습니다"
  }
}
