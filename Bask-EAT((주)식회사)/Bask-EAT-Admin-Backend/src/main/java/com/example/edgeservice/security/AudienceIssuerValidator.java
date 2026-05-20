package com.example.edgeservice.security;

import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;

public class AudienceIssuerValidator implements OAuth2TokenValidator<Jwt> {
    private final String audience;

    public AudienceIssuerValidator(String audience) {
        this.audience = audience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        if (token.getAudience() != null && token.getAudience().contains(audience)) {
            return OAuth2TokenValidatorResult.success();
        }
        return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", "Required audience missing", null)
        );
    }
}
