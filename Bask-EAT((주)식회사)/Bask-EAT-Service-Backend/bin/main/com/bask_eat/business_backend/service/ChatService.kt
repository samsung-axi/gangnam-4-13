package com.bask_eat.business_backend.service


import com.bask_eat.business_backend.model.dto.response.ConversationSummary
import com.bask_eat.business_backend.model.entity.ChatRoom
import com.bask_eat.business_backend.model.entity.Message
import com.bask_eat.business_backend.repository.ChatRoomRepository
import com.bask_eat.business_backend.repository.MessageRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class ChatService(
  private val chatRoomRepository: ChatRoomRepository,
  private val messageRepository: MessageRepository
) {

  suspend fun findOrCreateChat(chatId: String?, userId: String): ChatRoom {
    return if (chatId != null) {
      chatRoomRepository.findById(userId, chatId)
        ?: throw RuntimeException("채팅방을 찾을 수 없습니다: $chatId")
    } else {
      val newChat = ChatRoom(
        id = UUID.randomUUID().toString(),
        userId = userId,
        title = "새로운 대화"
      )
      chatRoomRepository.save(newChat)
    }
  }

  suspend fun combineMessages(userId: String, chat: ChatRoom, newMessage: String): List<Message> {
    val history = messageRepository.findByChat(userId, chat.id)
    val list = history.map {
      Message(role = it.role, content = it.content)
    }.toMutableList()
    list.add(Message(role = "user", content = newMessage))
    return list
  }

  suspend fun saveMessage(userId: String, chatId: String, userMsg: String, aiMsg: String) {
    messageRepository.save(userId, chatId, Message(role = "user", content = userMsg))
    messageRepository.save(userId, chatId, Message(role = "assistant", content = aiMsg))
    chatRoomRepository.updateLastActivity(userId, chatId, Date())
  }

  suspend fun getUserChats(userId: String): List<ConversationSummary> {
    return chatRoomRepository.findByUserId(userId).map { chat ->
      val last = messageRepository.findByChat(userId, chat.id).lastOrNull()?.content.orEmpty()
      ConversationSummary(
        id = chat.id,
        title = chat.title,
        lastMessage = last,
        updatedAt = chat.updatedAt
      )
    }
  }

  suspend fun getChatWithMessages(userId: String, chatId: String): Map<String, Any> {
    val chat = chatRoomRepository.findById(userId, chatId)
      ?: throw RuntimeException("채팅방을 찾을 수 없습니다: $chatId")
    val msgs = messageRepository.findByChat(userId, chatId)
    return mapOf("chat" to chat, "messages" to msgs)
  }

  suspend fun deleteChat(userId: String, chatId: String) =
    chatRoomRepository.delete(userId, chatId)
}