package com.bask_eat.business_backend.repository


import com.bask_eat.business_backend.model.entity.ChatRoom
import com.bask_eat.business_backend.service.FirestoreService
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class ChatRoomRepository(private val firestoreService: FirestoreService) {

  suspend fun save(chatRoom: ChatRoom) = firestoreService.saveChatRoom(chatRoom)

  suspend fun findById(userId: String, chatId: String) =
    firestoreService.findChatRoom(userId, chatId)

  suspend fun findByUserId(userId: String) =
    firestoreService.findChatRoomsByUser(userId)

  suspend fun updateLastActivity(userId: String, chatId: String, timestamp: Date) =
    firestoreService.updateChatRoomTimestamp(userId, chatId, timestamp)

  suspend fun delete(userId: String, chatId: String) =
    firestoreService.deleteChatRoom(userId, chatId)

}

