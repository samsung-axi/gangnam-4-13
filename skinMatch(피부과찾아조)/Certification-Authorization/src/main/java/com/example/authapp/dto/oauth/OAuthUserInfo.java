package com.example.authapp.dto.oauth;

import com.example.authapp.entity.Provider;

import java.util.Map;

public interface OAuthUserInfo {
    String getProviderId();
    String getEmail();
    String getName();
    String getProfileImage();
    Provider getProvider();

    // Google OAuth 사용자 정보
    class GoogleUserInfo implements OAuthUserInfo {
        private final Map<String, Object> attributes;

        public GoogleUserInfo(Map<String, Object> attributes) {
            this.attributes = attributes;
        }

        @Override
        public String getProviderId() {
            return String.valueOf(attributes.get("sub"));
        }

        @Override
        public String getEmail() {
            return String.valueOf(attributes.get("email"));
        }

        @Override
        public String getName() {
            return String.valueOf(attributes.get("name"));
        }

        @Override
        public String getProfileImage() {
            return String.valueOf(attributes.get("picture"));
        }

        @Override
        public Provider getProvider() {
            return Provider.GOOGLE;
        }
    }

    // Naver OAuth 사용자 정보
    class NaverUserInfo implements OAuthUserInfo {
        private final Map<String, Object> attributes;
        private final Map<String, Object> response;

        @SuppressWarnings("unchecked")
        public NaverUserInfo(Map<String, Object> attributes) {
            this.attributes = attributes;
            this.response = (Map<String, Object>) attributes.get("response");
        }

        @Override
        public String getProviderId() {
            return String.valueOf(response.get("id"));
        }

        @Override
        public String getEmail() {
            return String.valueOf(response.get("email"));
        }

        @Override
        public String getName() {
            return String.valueOf(response.get("name"));
        }

        @Override
        public String getProfileImage() {
            return String.valueOf(response.get("profile_image"));
        }

        @Override
        public Provider getProvider() {
            return Provider.NAVER;
        }
    }

    // 팩토리 메서드
    static OAuthUserInfo of(Provider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> new GoogleUserInfo(attributes);
            case NAVER -> new NaverUserInfo(attributes);
        };
    }
}