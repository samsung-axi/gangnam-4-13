package com.bask_eat.business_backend.util

import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.*

object DateUtils {

  private val ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME

  fun formatToIso(dateTime: Date): String {
    return dateTime.toString()
  }

  fun parseFromIso(dateTimeString: String): Date? {
    return try {
      Date(dateTimeString)
    } catch (e: DateTimeParseException) {
      null
    }
  }

  fun now(): Date = Date()
}
