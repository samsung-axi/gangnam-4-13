package com.bask_eat.business_backend.model.entity

data class Product(
  val productName: String,
  val price: Int,
  val imageUrl: String,
  val productAddress: String
)