package com.example.edgeservice.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class ReactiveJwtRoleConverter implements Converter<Jwt, Mono<AbstractAuthenticationToken>> {

    @Override
    public Mono<AbstractAuthenticationToken> convert(Jwt jwt) {
        var authorities = extractAuthorities(jwt);
        String name = Optional.ofNullable(jwt.getClaimAsString("preferred_username"))
                .orElse(Optional.ofNullable(jwt.getClaimAsString("email")).orElse(jwt.getSubject()));
        return Mono.just(new JwtAuthenticationToken(jwt, authorities, name));
    }

    private Collection<SimpleGrantedAuthority> extractAuthorities(Jwt jwt) {
        Set<String> roles = new HashSet<>();

        Object rolesClaim = jwt.getClaims().get("roles"); // 커스텀 roles
        if (rolesClaim instanceof Collection<?> c) c.forEach(v -> roles.add(String.valueOf(v)));

        Boolean admin = jwt.getClaim("admin");            // boolean admin:true 호환
        if (Boolean.TRUE.equals(admin)) roles.add("ADMIN");

        Object realmAccess = jwt.getClaims().get("realm_access"); // Keycloak 호환
        if (realmAccess instanceof Map<?,?> m) {
            Object r = m.get("roles");
            if (r instanceof Collection<?> c) c.forEach(v -> roles.add(String.valueOf(v)));
        }

        return roles.stream()
                .map(String::trim).filter(s -> !s.isEmpty())
                .map(s -> s.startsWith("ROLE_") ? s : "ROLE_" + s)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }
}
