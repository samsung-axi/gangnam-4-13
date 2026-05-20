package com.example.authapp.service;

import com.example.authapp.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter
public class OAuth2UserPrincipal implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;

    public OAuth2UserPrincipal(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(user.getRole());
    }

    @Override
    public String getName() {
        return user.getName();
    }

    // 사용자 이메일 반환
    public String getEmail() {
        return user.getEmail();
    }

    // 사용자 ID 반환
    public Long getUserId() {
        return user.getId();
    }
}