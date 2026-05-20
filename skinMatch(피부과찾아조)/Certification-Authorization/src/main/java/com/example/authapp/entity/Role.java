package com.example.authapp.entity;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private final String authority;

    Role(String authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    public String getValue() {
        return authority;
    }

    // Spring Security에서 사용할 권한 컬렉션 반환
    public java.util.Collection<? extends GrantedAuthority> getAuthorities() {
        return java.util.Collections.singletonList(this);
    }
}