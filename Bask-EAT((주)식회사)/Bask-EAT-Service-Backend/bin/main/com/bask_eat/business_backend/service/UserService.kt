package com.bask_eat.business_backend.service


import com.bask_eat.business_backend.model.entity.User
import com.bask_eat.business_backend.model.enums.UserRole
import com.google.firebase.auth.FirebaseToken
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
  private val firestoreService: FirestoreService
) {

  suspend fun findOrCreateUser(decodedToken: FirebaseToken): User {
    val uid = decodedToken.uid
    val email = decodedToken.email
    val name = decodedToken.name
    val picture = decodedToken.picture

    // 기존 사용자 조회
    var user = firestoreService.findUserById(uid)

    if (user == null) {
      // 새 사용자 생성
      user = User(
        id = uid,
        email = email,
        name = name ?: "사용자",
        profileImageUrl = picture,
        provider = "google",
        providerId = uid,
        role = UserRole.USER,
        createdAt = Date(),
        updatedAt = Date(),
        isActive = true
      )

      firestoreService.saveUser(user)
    } else {
      // 기존 사용자 정보 업데이트
      val updatedUser = user.copy(
        name = name ?: user.name,
        profileImageUrl = picture ?: user.profileImageUrl,
        updatedAt = Date()
      )

      firestoreService.saveUser(updatedUser)
      user = updatedUser
    }

    return user
  }

  suspend fun findById(userId: String): User? {
    return firestoreService.findUserById(userId)
  }

  suspend fun updateProfile(userId: String, updateRequest: Map<String, String>): User? {
    val user = findById(userId) ?: return null

    val updatedUser = user.copy(
      name = updateRequest["name"] ?: user.name,
      updatedAt = Date()
    )

    return firestoreService.saveUser(updatedUser)
  }
}
