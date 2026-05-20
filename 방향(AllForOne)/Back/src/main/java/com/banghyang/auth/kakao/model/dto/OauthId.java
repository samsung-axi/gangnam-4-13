package com.banghyang.auth.kakao.model.dto;

import com.banghyang.common.type.OauthServerType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OauthId {

    @Column(nullable = false)
    private String oauthServerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "oauth_server")
    private OauthServerType oauthServerType;

    public String OauthId() {
        return oauthServerId;
    }

    public OauthServerType OauthServer() {
        return oauthServerType;
    }
}
