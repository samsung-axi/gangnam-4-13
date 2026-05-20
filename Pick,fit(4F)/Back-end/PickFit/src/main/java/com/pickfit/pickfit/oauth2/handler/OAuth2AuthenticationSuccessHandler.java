package com.pickfit.pickfit.oauth2.handler;

import com.pickfit.pickfit.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.pickfit.pickfit.oauth2.model.dto.UserDTO;
import com.pickfit.pickfit.oauth2.model.service.UserService;
import com.pickfit.pickfit.oauth2.service.OAuth2UserPrincipal;
import com.pickfit.pickfit.oauth2.user.OAuth2Provider;
import com.pickfit.pickfit.oauth2.user.OAuth2UserUnlinkManager;
import com.pickfit.pickfit.oauth2.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static com.pickfit.pickfit.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.MODE_PARAM_COOKIE_NAME;
import static com.pickfit.pickfit.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final OAuth2UserUnlinkManager oAuth2UserUnlinkManager;
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
//        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
        String targetUrl = "http://localhost:3000"; // targetUrl 로그인 후  메인페이지로 이동하라고 명시

        String mode = CookieUtils.getCookie(request, MODE_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse("");

        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);



        if (principal == null) {
            log.warn("principal이 null이랍니다...");
            return UriComponentsBuilder.fromUriString(targetUrl)
                    .queryParam("error", "Login failed")
                    .build().toUriString();
        }

        if ("login".equalsIgnoreCase(mode)) {
            log.info("email={}, name={}, nickname={}, accessToken={}",
                    principal.getUserInfo().getEmail(),
                    principal.getUserInfo().getName(),
                    principal.getUserInfo().getAccessToken()
            );

            String userEmail = principal.getUserInfo().getEmail();
            String userName = principal.getUserInfo().getName();

            // 사용자 정보를 UserService를 통해 저장 또는 업데이트
            UserDTO user = new UserDTO(userEmail, userName);
            userService.handleOAuth2Login(user);

            // 사용자 정보를 URL에 노출하지 않고 내부 처리만 수행
            log.info("User login processed successfully: {}", user);

            // 리다이렉트 URL 유지 (민감한 정보 제거)
            return UriComponentsBuilder.fromUriString(targetUrl)
                    .build().toUriString();

        } else if ("unlink".equalsIgnoreCase(mode)) {
            String accessToken = principal.getUserInfo().getAccessToken();
            OAuth2Provider provider = principal.getUserInfo().getProvider();

            // OAuth2 계정 연결 해제
            oAuth2UserUnlinkManager.unlink(provider, accessToken);

            return UriComponentsBuilder.fromUriString(targetUrl)
                    .build().toUriString();
        }

        return UriComponentsBuilder.fromUriString(targetUrl)
//                .queryParam("error", "Login failed")
                .build().toUriString();
    }

    private OAuth2UserPrincipal getOAuth2UserPrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2UserPrincipal) {
            return (OAuth2UserPrincipal) principal;
        }
        return null;
    }

    private void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    private String encodeValue(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            log.error("Encoding error: ", e);
            return value;
        }
    }
}
