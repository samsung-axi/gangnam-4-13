package com.bask_eat.business_backend.config


import com.bask_eat.business_backend.security.CustomUserDetails
import com.bask_eat.business_backend.security.FirebaseTokenFilter
import com.bask_eat.business_backend.security.JwtAuthenticationFilter
import com.bask_eat.business_backend.security.JwtTokenProvider
import com.bask_eat.business_backend.service.UserService
import kotlinx.coroutines.runBlocking
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.security.web.authentication.AuthenticationFailureHandler
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.security.web.context.SecurityContextRepository
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
  private val firebaseTokenFilter: FirebaseTokenFilter,
  private val jwtAuthenticationFilter: JwtAuthenticationFilter,
  private val jwtTokenProvider: JwtTokenProvider,
  private val userService: UserService
) {

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
  return http
      .securityMatcher("/api/**", "/fh/api/**")
      .csrf { it.disable() }
      .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
      .headers { headers ->
        headers.frameOptions().deny()
      }
      .authorizeHttpRequests { auth ->
        auth
          .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/auth/**", "/fh/api/auth/**").permitAll()
          .requestMatchers("/api/health").permitAll()
          .anyRequest().authenticated()
      }
      .addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter::class.java)
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
      .oauth2Login { oauth2 ->
        oauth2
          .successHandler(oauth2AuthenticationSuccessHandler())
          .failureHandler(oauth2AuthenticationFailureHandler())
      }
      .exceptionHandling { exceptions ->
        exceptions
          .authenticationEntryPoint(customAuthenticationEntryPoint())
          .accessDeniedHandler(customAccessDeniedHandler())
      }
      .cors { it.configurationSource(corsConfigurationSource()) }
      .securityContext { spec ->
        spec.securityContextRepository(securityContextRepository())
      }
      .build()
  }

  @Bean
  fun oauth2AuthenticationSuccessHandler(): AuthenticationSuccessHandler {
    return AuthenticationSuccessHandler { _, response, _ ->
      response.sendRedirect("/api/auth/success")
    }
  }

  @Bean
  fun oauth2AuthenticationFailureHandler(): AuthenticationFailureHandler {
    return AuthenticationFailureHandler { _, response, _ ->
      response.sendRedirect("/api/auth/error")
    }
  }

  @Bean
  fun customAuthenticationEntryPoint(): AuthenticationEntryPoint {
    return AuthenticationEntryPoint { _, response, _ ->
      response.sendError(401, "Unauthorized")
    }
  }

  @Bean
  fun customAccessDeniedHandler(): AccessDeniedHandler {
    return AccessDeniedHandler { _, response, _ ->
      response.sendError(403, "Access Denied")
    }
  }

  @Bean
  fun passwordEncoder(): PasswordEncoder {
    return BCryptPasswordEncoder()
  }

  @Bean
  fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration()
    configuration.allowedOriginPatterns = listOf("*")
    configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
    configuration.allowedHeaders = listOf("*")
    configuration.exposedHeaders = listOf("Authorization", "X-Access-Token")
    configuration.allowCredentials = true

    val source = UrlBasedCorsConfigurationSource()
    source.registerCorsConfiguration("/**", configuration)
    return source
  }

  @Bean
  fun authenticationManager(http: HttpSecurity): AuthenticationManager {
    // UserDetailsService와 PasswordEncoder를 사용하지 않을 경우,
    // 빈 AuthenticationProvider가 없으면 빈으로 반환되지 않음.
    return http
      .getSharedObject(AuthenticationManagerBuilder::class.java)
      .authenticationProvider(jwtAuthenticationProvider())
      .build()
  }

  @Bean
  fun jwtAuthenticationProvider(): AuthenticationProvider {
    val provider = DaoAuthenticationProvider()
    provider.setUserDetailsService { username ->
      val user = runBlocking { userService.findById(username) }
        ?: throw UsernameNotFoundException("User not found: $username") as Throwable
      CustomUserDetails(user)
    }
    provider.setPasswordEncoder(passwordEncoder())
    return provider
  }

  @Bean
  fun securityContextRepository(): SecurityContextRepository =
    HttpSessionSecurityContextRepository()


}
