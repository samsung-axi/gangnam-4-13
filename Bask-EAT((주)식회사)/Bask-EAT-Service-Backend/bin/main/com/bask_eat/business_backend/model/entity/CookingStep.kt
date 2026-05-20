package com.bask_eat.business_backend.model.entity

data class CookingStep(
  val stepNumber: Int = 0,
  val description: String = "",
  val duration: String? = null,
  val temperature: String? = null
)