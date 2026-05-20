package com.example.authapp.service;

import com.example.authapp.dto.oauth.OAuthUserInfo;
import com.example.authapp.dto.request.LoginRequest;
import com.example.authapp.dto.request.SignupRequest;
import com.example.authapp.dto.response.LoginResponse;
import com.example.authapp.dto.response.TokenInfo;
import com.example.authapp.entity.Provider;
import com.example.authapp.entity.RefreshToken;
import com.example.authapp.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    // OAuth2 사용자 정보 로드 및 처리
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception e) {
            log.error("OAuth2 user processing failed", e);
            throw new OAuth2AuthenticationException("OAuth2 사용자 처리 실패");
        }
    }

    // OAuth2 사용자 처리
    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Provider provider = Provider.fromString(registrationId);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        OAuthUserInfo oAuthUserInfo = OAuthUserInfo.of(provider, attributes);

        // 사용자 생성 또는 업데이트
        User user = userService.createOrUpdateOAuthUser(oAuthUserInfo);

        // OAuth2UserPrincipal 생성하여 반환
        return new OAuth2UserPrincipal(user, attributes);
    }

    // 일반 회원가입
    @Transactional
    public User signup(SignupRequest request) {
        // 비밀번호 확인 검증
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // 이메일 중복 검사
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용중인 이메일입니다.");
        }

        // 아이디 중복 검사
        if (userService.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 닉네임이 없으면 아이디를 닉네임으로 사용
        String nickname = (request.getNickname() != null && !request.getNickname().trim().isEmpty()) 
                ? request.getNickname().trim() 
                : request.getUsername();

        // 사용자 생성 (일반 회원가입) - 닉네임 매개변수 추가
        User user = User.createRegularUser(
                request.getEmail(),
                request.getUsername(),
                request.getUsername(), // name으로 username 사용
                encodedPassword,
                request.getAddress(),
                nickname // 처리된 닉네임 전달
        );

        User savedUser = userService.save(user);
        log.info("Regular user registered successfully: {} (nickname: {})", savedUser.getEmail(), nickname);

        return savedUser;
    }

    // 일반 로그인
    @Transactional
    public LoginResponse regularLogin(LoginRequest request) {
        log.info("로그인 시도 - loginId: {}", request.getLoginId());
        
        // 아이디 또는 이메일로 사용자 조회
        User user = findUserByLoginId(request.getLoginId())
                .orElseThrow(() -> {
                    log.warn("사용자를 찾을 수 없음 - loginId: {}", request.getLoginId());
                    return new RuntimeException("존재하지 않는 사용자입니다.");
                });

        log.info("사용자 찾음 - email: {}, username: {}, provider: {}", 
                user.getEmail(), user.getUsername(), user.getProvider());

        // OAuth 사용자인지 확인
        if (user.getProvider() != null) {
            throw new RuntimeException("소셜 로그인 사용자입니다. " + user.getProvider().name() + " 로그인을 이용해주세요.");
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("비밀번호 불일치 - loginId: {}", request.getLoginId());
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        log.info("로그인 성공 - user: {}", user.getEmail());
        // JWT 토큰 생성 및 로그인 처리
        return login(user);
    }

    // 아이디 또는 이메일로 사용자 찾기
    private Optional<User> findUserByLoginId(String loginId) {
        log.info("사용자 검색 시작 - loginId: {}", loginId);
        
        // 이메일 형식인지 확인
        if (loginId.contains("@")) {
            log.info("이메일 형식으로 검색: {}", loginId);
            Optional<User> user = userService.findByEmail(loginId);
            log.info("이메일 검색 결과: {}", user.isPresent() ? "찾음" : "못찾음");
            return user;
        } else {
            log.info("아이디 형식으로 검색: {}", loginId);
            Optional<User> user = userService.findByUsername(loginId);
            log.info("아이디 검색 결과: {}", user.isPresent() ? "찾음" : "못찾음");
            return user;
        }
    }

    // 로그인 처리 - JWT 토큰 생성
    @Transactional
    public LoginResponse login(User user) {
        // 로그인 상태 업데이트
        user.updateLoginStatus();
        userService.save(user);
        
        // Access Token 생성
        String accessToken = jwtService.generateAccessToken(user);

        // Refresh Token 생성 및 저장
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        log.info("User logged in successfully: {}", user.getEmail());

        return LoginResponse.of(accessToken, refreshToken.getToken(), user);
    }

    // Access Token 재발급
    @Transactional
    public TokenInfo refreshToken(String refreshTokenValue) {
        // Refresh Token 유효성 검증
        if (!refreshTokenService.validateRefreshToken(refreshTokenValue)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }

        // 새로운 Access Token 생성
        String newAccessToken = refreshTokenService.refreshAccessToken(refreshTokenValue);

        // Refresh Token 정보 조회
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Refresh Token을 찾을 수 없습니다."));

        return TokenInfo.of(
                newAccessToken,
                refreshTokenValue,
                86400L, // 24시간 (초)
                604800L // 7일 (초)
        );
    }

    // 로그아웃 처리
    @Transactional
    public void logout(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue)
                .orElse(null);

        if (refreshToken != null) {
            // 사용자 온라인 상태 업데이트
            User user = refreshToken.getUser();
            user.updateLogoutStatus();
            userService.save(user);
            
            refreshTokenService.deleteRefreshToken(refreshToken);
            log.info("User logged out successfully: {}", user.getEmail());
        }
    }

    // 사용자 ID로 로그아웃 처리
    @Transactional
    public void logout(Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 사용자 온라인 상태 업데이트
        user.updateLogoutStatus();
        userService.save(user);

        refreshTokenService.deleteRefreshTokenByUser(user);
        log.info("User logged out successfully: {}", user.getEmail());
    }

    // JWT 토큰에서 사용자 정보 조회
    public User getUserFromToken(String token) {
        String email = jwtService.getEmailFromToken(token);
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            String email = jwtService.getEmailFromToken(token);
            return jwtService.isTokenValid(token, email);
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    // 이메일에서 사용자명 생성 유틸리티 메서드
    private String generateUsernameFromEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "user" + System.currentTimeMillis();
        }
        return email.substring(0, email.indexOf("@"));
    }
}