package com.bask_eat.business_backend.model.entity

data class Ingredient(
  val item: String,
  val amount: String = "",
  val unit: String = ""
)