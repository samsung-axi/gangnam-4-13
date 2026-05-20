package com.bask_eat.business_backend.controller

import com.bask_eat.business_backend.model.dto.response.UserDto
import com.bask_eat.business_backend.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
  private val userService: UserService
) {

  @GetMapping("/profile")
  suspend fun getUserProfile(authentication: Authentication): ResponseEntity<UserDto> {
    val userId = authentication.name
    val user = userService.findById(userId)
      ?: return ResponseEntity.notFound().build()

    return ResponseEntity.ok(UserDto(
      id = user.id,
      email = user.email,
      name = user.name,
      profileImageUrl = user.profileImageUrl
    ))
  }

  @PutMapping("/profile")
  suspend fun updateUserProfile(
    @RequestBody updateRequest: Map<String, String>,
    authentication: Authentication
  ): ResponseEntity<UserDto> {
    val userId = authentication.name
    val updatedUser = userService.updateProfile(userId, updateRequest)
      ?: return ResponseEntity.notFound().build()

    return ResponseEntity.ok(UserDto(
      id = updatedUser.id,
      email = updatedUser.email,
      name = updatedUser.name,
      profileImageUrl = updatedUser.profileImageUrl
    ))
  }
}
