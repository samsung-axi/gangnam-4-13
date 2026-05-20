package com.bask_eat.business_backend.model.entity

import java.util.Date

data class Recipe(
  val id: String = "",
  val name: String = "",
  val description: String? = null,
  val ingredients: List<Ingredient> = emptyList(), // 재료 리스트
  val cookingMethods: List<CookingStep> = emptyList(), // 조리 방법 리스트
  val cookingTime: String? = null,
  val servings: String? = null,
  val difficulty: String? = null,
  val category: String? = null,
  val createdAt: Date = Date(),
  val updatedAt: Date = Date()
) {
  companion object {
    const val COLLECTION_NAME = "recipes"
  }
}