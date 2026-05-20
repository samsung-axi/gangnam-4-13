package com.pickfit.pickfit.oauth2.model.controller;

import com.pickfit.pickfit.oauth2.model.dto.UserDTO;
import com.pickfit.pickfit.oauth2.model.entity.UserEntity;
import com.pickfit.pickfit.oauth2.model.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class); // Logger 추가

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 로그인한 사용자 조회
    @GetMapping("/user")
    public UserDTO getCurrentUser(Authentication authentication) {
        logger.info("GET /api/user - 요청 수신");

        if (authentication == null) {
            logger.warn("GET /api/user - 인증되지 않은 요청");
            throw new RuntimeException("Unauthorized");
        }

        // Principal 타입과 내용을 디버깅 로그로 출력
        Object principal = authentication.getPrincipal();
        logger.debug("GET /api/user - Principal 타입: {}", principal.getClass());
        logger.debug("GET /api/user - Principal 내용: {}", principal);

        String email;
        String name;

        // Principal 타입에 따라 분기 처리
        if (principal instanceof com.pickfit.pickfit.oauth2.service.OAuth2UserPrincipal) {
            var oAuth2Principal = (com.pickfit.pickfit.oauth2.service.OAuth2UserPrincipal) principal;
            email = oAuth2Principal.getUserInfo().getEmail(); // 커스텀 메서드를 사용해 이메일 추출
            name = oAuth2Principal.getUserInfo().getName();   // 커스텀 메서드를 사용해 이름 추출
            logger.info("GET /api/user - OAuth2UserPrincipal 인증된 사용자: email={}, name={}", email, name);
        } else if (principal instanceof org.springframework.security.oauth2.core.user.DefaultOAuth2User) {
            var oAuth2User = (org.springframework.security.oauth2.core.user.DefaultOAuth2User) principal;
            email = (String) oAuth2User.getAttributes().get("email");
            name = (String) oAuth2User.getAttributes().get("name");
            logger.info("GET /api/user - DefaultOAuth2User 인증된 사용자: email={}, name={}", email, name);
        } else if (principal instanceof String) {
            email = (String) principal;
            name = authentication.getName();
            logger.info("GET /api/user - String Principal 인증된 사용자: email={}, name={}", email, name);
        } else {
            logger.warn("GET /api/user - Principal 타입 불일치: {}", principal.getClass());
            throw new RuntimeException("Unauthorized");
        }

        UserEntity user = userService.handleOAuth2Login(new UserDTO(email, name, null, null,null, null, null));
        logger.info("GET /api/user - 사용자 데이터 반환: {}", user);

        return new UserDTO(
                user.getEmail(),
                user.getName(),
                user.getPhoneNum(),
                user.getProfile(),
                user.getAddress(),
                user.getNickname(),
                user.getRole()
        );
    }



    // 사용자의 닉네임과 전화번호 업데이트
    @PutMapping("/user")
    public UserDTO updateUserDetails(
            @RequestBody UserDTO userDTO,
            Authentication authentication) {

        logger.info("PUT /api/user - 요청 수신: {}", userDTO);

        if (authentication == null) {
            logger.warn("PUT /api/user - 인증되지 않은 요청");
            throw new RuntimeException("Unauthorized");
        }

        if (!(authentication.getPrincipal() instanceof String)) {
            logger.warn("PUT /api/user - Principal 타입 불일치");
            throw new RuntimeException("Unauthorized");
        }

        String email = (String) authentication.getPrincipal();
        logger.info("PUT /api/user - 인증된 사용자: email={}", email);

        UserEntity updatedUser = userService.updateUserDetails(userDTO);
        logger.info("PUT /api/user - 사용자 데이터 업데이트 완료: {}", updatedUser);

        return new UserDTO(
                updatedUser.getEmail(),
                updatedUser.getName(),
                updatedUser.getPhoneNum(),
                updatedUser.getProfile(),
                updatedUser.getAddress(),
                updatedUser.getNickname(),
                updatedUser.getRole()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // 세션 무효화
        request.getSession().invalidate();

        // 쿠키 삭제
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 쿠키 만료
        response.addCookie(cookie);

        // 간단한 성공 응답 반환
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/update")
    public ResponseEntity<UserDTO> updateUserPhoneNumber(@RequestBody UserDTO userDTO) {
        logger.info("POST /api/update - 요청 수신: email={}, phoneNum={}", userDTO.getEmail(), userDTO.getPhoneNum());

        try {
            // 서비스 로직 호출
            UserEntity updatedUser = userService.updateUserDetails(userDTO);
            logger.info("POST /api/update - 사용자 데이터 업데이트 완료: {}", updatedUser);

            // 업데이트된 사용자 정보 반환
            return ResponseEntity.ok(new UserDTO(
                    updatedUser.getEmail(),
                    updatedUser.getName(),
                    updatedUser.getPhoneNum(),
                    updatedUser.getProfile(),
                    updatedUser.getAddress(),
                    updatedUser.getNickname(),
                    updatedUser.getRole()

            ));
        } catch (IllegalArgumentException e) {
            logger.error("POST /api/update - 에러 발생: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

}

