package com.bask_eat.business_backend.model.entity

data class Recipe(
  val source: String,
  val food_name: String,
  val ingredients: List<Ingredient>? = null, // hatType이 recipe일 때 사용, 재료 목록
  val recipe: List<String>? = null, // chatType이 recipe일 때 사용, 조리 순서
  val product: List<Product>? = null // chatType이 product일 때 사용, 상품 목록
)