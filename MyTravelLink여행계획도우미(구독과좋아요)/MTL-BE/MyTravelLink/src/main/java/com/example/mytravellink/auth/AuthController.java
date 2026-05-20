package com.example.mytravellink.auth;

import com.example.mytravellink.auth.handler.JwtTokenProvider;
import com.example.mytravellink.domain.users.entity.Users;
import com.example.mytravellink.domain.users.repository.UsersRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final UsersRepository memberRepository;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;
    
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;
    
    @Value("${url.google.access-token}")
    private String accessTokenUrl;
    
    @Value("${url.google.profile}")
    private String profileUrl; // 예: "https://www.googleapis.com/oauth2/v3/userinfo"

    @GetMapping("/auth/google/callback")
    public void googleCallback(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        log.debug("OAuth2 callback 호출됨. 받은 code: {}", code);
        
        // 1. 구글에 access token 요청
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        log.debug("Google access token 요청 파라미터: {}", params);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
        ResponseEntity<String> tokenResponse = restTemplate.exchange(accessTokenUrl, HttpMethod.POST, requestEntity, String.class);
        log.debug("Google Token Response: {}", tokenResponse.getBody());

        // 2. 액세스 토큰 추출
        String accessToken = extractAccessToken(tokenResponse.getBody());
        if (accessToken == null) {
            log.error("Google access token 추출 실패");
            response.sendRedirect("https://mytravellink.site/loginError");
            return;
        }
        log.debug("추출된 Google Access Token: {}", accessToken);

        // 3. 사용자 정보 요청
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.set("Authorization", "Bearer " + accessToken);
        HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);
        log.debug("Google UserInfo 요청 헤더: {}", userInfoHeaders);

        ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                profileUrl,
                HttpMethod.GET,
                userInfoEntity,
                String.class
        );
        log.debug("Google UserInfo Response: {}", userInfoResponse.getBody());

        // 4. 사용자 정보 처리 및 회원가입 로직 (name과 email 추출)
        Users member = processUserInfo(userInfoResponse.getBody());
        if (member == null) {
            log.error("사용자 정보 처리 실패");
            response.sendRedirect("https://mytravellink.site/loginError");
            return;
        }
        log.debug("처리된 사용자 정보: {}", member);

        // 5. 백엔드 토큰 생성 후 프론트로 전달
        String backendAccessToken = jwtTokenProvider.generateToken(member);
        log.debug("생성된 백엔드 JWT 토큰: {}", backendAccessToken);

        // 6. 리다이렉트 URL 구성 (토큰, 사용자 이메일, 사용자 이름 포함)
        String encodedToken = URLEncoder.encode(backendAccessToken, "UTF-8");
        String encodedEmail = URLEncoder.encode(member.getEmail(), "UTF-8");
        String encodedName = URLEncoder.encode(member.getName(), "UTF-8");
        String redirectUrl = "https://mytravellink.site/loginSuccess?token=" + encodedToken 
                             + "&email=" + encodedEmail 
                             + "&name=" + encodedName;
        log.debug("리다이렉트할 URL: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    // 응답 본문에서 access_token 추출
    private String extractAccessToken(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String token = jsonNode.get("access_token").asText();
            log.debug("응답 본문에서 추출한 access_token: {}", token);
            return token;
        } catch (Exception e) {
            log.error("Access token 추출 중 오류 발생", e);
            return null;
        }
    }

    // 사용자 정보를 처리하여 기존 사용자가 없으면 저장 후 반환 (이름과 이메일 추출)
    private Users processUserInfo(String userInfo) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(userInfo);
            String name = jsonNode.get("name").asText();
            String email = jsonNode.get("email").asText();
            String picture = jsonNode.get("picture").asText();
            log.debug("Google UserInfo - name: {}, email: {}, picture: {}", name, email, picture);

            Optional<Users> optionalUser = memberRepository.findByEmail(email);
            Users user;
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
                log.debug("기존 사용자 발견: {}", user);
            } else {
                user = Users.builder()
                        .email(email)
                        .name(name)
                        .profileImg(picture)
                        .build();
                memberRepository.save(user);
                log.debug("새로운 사용자 등록: {}", user);
            }
            return user;
        } catch (Exception e) {
            log.error("사용자 정보 처리 중 오류 발생", e);
            return null;
        }
    }
}