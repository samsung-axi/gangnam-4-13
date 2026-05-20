package com.bask_eat.business_backend.security

import com.bask_eat.business_backend.model.entity.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
  private val user: User
) : UserDetails {

  override fun getAuthorities(): Collection<GrantedAuthority> {
    return listOf(SimpleGrantedAuthority("ROLE_${user.role.name}"))
  }

  override fun getPassword(): String = ""

  override fun getUsername(): String = user.id

  override fun isAccountNonExpired(): Boolean = user.isActive

  override fun isAccountNonLocked(): Boolean = user.isActive

  override fun isCredentialsNonExpired(): Boolean = true

  override fun isEnabled(): Boolean = user.isActive

  fun getUser(): User = user
}
