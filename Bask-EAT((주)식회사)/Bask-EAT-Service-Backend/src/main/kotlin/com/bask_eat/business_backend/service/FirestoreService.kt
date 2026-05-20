package com.bask_eat.business_backend.service


import com.bask_eat.business_backend.model.entity.ChatRoom
import com.bask_eat.business_backend.model.entity.Message
import com.bask_eat.business_backend.model.entity.User
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.Query
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service
import java.util.*

@Service
class FirestoreService(private val firestore: Firestore) {

  // User document root
  private fun userDoc(userId: String) =
    firestore.collection("users").document(userId)

  // chats subcollection under user
  private fun chatsCol(userId: String) =
    userDoc(userId).collection(ChatRoom.COLLECTION_NAME)

  // messages subcollection under specific chat
  private fun messagesCol(userId: String, chatId: String) =
    chatsCol(userId).document(chatId).collection(Message.COLLECTION_NAME)

  // --- ChatRoom (formerly Conversation) ---

  suspend fun saveChatRoom(chatRoom: ChatRoom): ChatRoom = withContext(Dispatchers.IO) {
    val docRef = chatsCol(chatRoom.userId).document(chatRoom.id)
    docRef.set(chatRoom).get()
    chatRoom
  }

  suspend fun findChatRoom(userId: String, chatId: String): ChatRoom? = withContext(Dispatchers.IO) {
    val snap = chatsCol(userId).document(chatId).get().get()
    snap.toObject(ChatRoom::class.java)
  }

  suspend fun findChatRoomsByUser(userId: String): List<ChatRoom> = withContext(Dispatchers.IO) {
    chatsCol(userId)
      .orderBy("updatedAt", Query.Direction.DESCENDING)
      .get().get()
      .documents.mapNotNull { it.toObject(ChatRoom::class.java) }
  }

  suspend fun updateChatRoomTimestamp(userId: String, chatId: String, timestamp: Date) {
    withContext(Dispatchers.IO) {
      chatsCol(userId).document(chatId)
        .update("updatedAt", timestamp).get()
    }
  }

  suspend fun deleteChatRoom(userId: String, chatId: String) {
    withContext(Dispatchers.IO) {
      // Delete all messages in subcollection
      val batch = firestore.batch()
      messagesCol(userId, chatId).get().get().documents.forEach { doc ->
        batch.delete(doc.reference)
      }
      // Delete chatRoom doc
      batch.delete(chatsCol(userId).document(chatId))
      batch.commit().get()
    }
  }

  // --- Message ---

  suspend fun saveMessage(userId: String, chatId: String, message: Any): Any {
    messagesCol(userId, chatId).add(message).get()
    return message
  }

  suspend fun findMessages(userId: String, chatId: String): List<Message> = withContext(Dispatchers.IO) {
    messagesCol(userId, chatId)
      .orderBy("timestamp", Query.Direction.ASCENDING)
      .get().get()
      .documents.mapNotNull { it.toObject(Message::class.java) }
  }

  // --- User ---

  suspend fun saveUser(user: User): User = withContext(Dispatchers.IO) {
    userDoc(user.id).set(user).get()
    user
  }

  suspend fun findUserById(userId: String): User? = withContext(Dispatchers.IO) {
    val snap = userDoc(userId).get().get()
    if (snap.exists()) snap.toObject(User::class.java) else null
  }
}
