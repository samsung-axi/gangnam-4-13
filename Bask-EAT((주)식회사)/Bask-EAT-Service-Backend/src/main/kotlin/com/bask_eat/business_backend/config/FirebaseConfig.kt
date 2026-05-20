package com.bask_eat.business_backend.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.cloud.FirestoreClient
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import jakarta.annotation.PostConstruct

@Configuration
class FirebaseConfig {

  @Value("\${firebase.config.file-path}")
  private lateinit var firebaseConfigPath: String

  @PostConstruct
  fun initializeFirebase() {
    try {
      val cl = this::class.java.classLoader
      var serviceStream = cl.getResourceAsStream(firebaseConfigPath)
      if (serviceStream == null) {
        // fallback to direct file path
        val file = java.io.File(firebaseConfigPath)
        if (file.exists()) {
          serviceStream = file.inputStream()
          logger.info("Loaded Firebase credentials from file path: {}", file.absolutePath)
        } else {
          throw IllegalStateException("Firebase credentials not found at: $firebaseConfigPath (classpath and file path)")
        }
      } else {
        logger.info("Loaded Firebase credentials from classpath: {}", firebaseConfigPath)
      }

      val options = FirebaseOptions.builder()
        .setCredentials(GoogleCredentials.fromStream(serviceStream))
        .build()

      if (FirebaseApp.getApps().isEmpty()) {
        FirebaseApp.initializeApp(options)
        logger.info("Firebase DEFAULT app initialized")
      }
    } catch (e: Exception) {
      logger.error("Firebase 초기화 실패", e)
      throw RuntimeException("Firebase 초기화에 실패했습니다.", e)
    }
  }

  @Bean
  fun firestore(): Firestore {
    return FirestoreClient.getFirestore()
  }

  @Bean
  fun firebaseAuth(): FirebaseAuth {
    return FirebaseAuth.getInstance()
  }

  companion object {
    private val logger = LoggerFactory.getLogger(FirebaseConfig::class.java)
  }
}
