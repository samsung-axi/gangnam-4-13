package com.bask_eat.business_backend.model.enums

import com.fasterxml.jackson.annotation.JsonFormat

@JsonFormat(shape = JsonFormat.Shape.STRING)
enum class JobStatus {
  //  PENDING,
//  PROCESSING,
//  COMPLETED,
//  FAILED,
  pending,
  processing,
  completed,
  failed

}
