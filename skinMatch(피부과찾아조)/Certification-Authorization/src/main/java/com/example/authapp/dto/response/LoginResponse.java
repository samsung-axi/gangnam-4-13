package com.example.authapp.dto.response;

import com.example.authapp.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserInfo user;

    @Getter
    @Builder
    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private String profileImage;
        private String provider;
        private String role;

        public static UserInfo from(User user) {
            return UserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .profileImage(user.getProfileImage())
                    .provider(user.getProvider() != null ? user.getProvider().getValue() : "REGULAR")
                    .role(user.getRole().name())
                    .build();
        }
    }

    public static LoginResponse of(String accessToken, String refreshToken, User user) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserInfo.from(user))
                .build();
    }
}