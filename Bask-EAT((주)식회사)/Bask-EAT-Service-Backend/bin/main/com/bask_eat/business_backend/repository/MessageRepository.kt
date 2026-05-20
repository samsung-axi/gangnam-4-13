package com.bask_eat.business_backend.repository

import com.bask_eat.business_backend.service.FirestoreService
import org.springframework.stereotype.Repository

@Repository
class MessageRepository(private val firestoreService: FirestoreService) {

  suspend fun save(userId: String, chatId: String, message: Any) =
    firestoreService.saveMessage(userId, chatId, message)

  suspend fun findByChat(userId: String, chatId: String) =
    firestoreService.findMessages(userId, chatId)
}
