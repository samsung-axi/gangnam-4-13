package com.banghyang.auth.kakao.service;

import com.banghyang.auth.kakao.client.KakaoAPIClient;
import com.banghyang.auth.kakao.config.KakaoOauthConfig;
import com.banghyang.auth.kakao.model.dto.KakaoMemberResponse;
import com.banghyang.auth.kakao.model.dto.KakaoToken;
import com.banghyang.auth.kakao.model.dto.OauthMemberResponse;
import com.banghyang.member.entity.Member;
import com.banghyang.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final KakaoOauthConfig kakaoOauthConfig;
    private final KakaoAPIClient kakaoAPIClient;
    private final MemberRepository memberRepository;

    public String getKakaoAuthCodeRequestUrl() {
        return UriComponentsBuilder
                .fromUriString("https://kauth.kakao.com/oauth/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", kakaoOauthConfig.clientId())
                .queryParam("redirect_uri", kakaoOauthConfig.redirectUri())
                .queryParam("scope", String.join(",", kakaoOauthConfig.scope()))
                .toUriString();
    }

    public OauthMemberResponse createOauthMemberFromKakao(String authCode) {
        System.out.println("AuthCode 값 확인 : " + authCode);
        // AccessToken 발급
        KakaoToken token = kakaoAPIClient.getToken(
                "authorization_code",
                kakaoOauthConfig.clientId(),
                kakaoOauthConfig.redirectUri(),
                authCode,
                kakaoOauthConfig.clientSecret()
        );

        // 사용자 정보 가져오기
        KakaoMemberResponse kakaoMemberResponse = kakaoAPIClient
                .getKakaoMember("bearer " + token.accessToken());
        System.out.println("AccessToken값 확인 : " + token.accessToken());

        // 사용자 정보를 엔티티로 변환
        Member member = kakaoMemberResponse.toEntity();

        // 기존 사용자인지 확인하고 신규 사용자라면 저장
        Member saved = memberRepository.findByOauthId(member.getOauthId())
                .orElseGet(() -> memberRepository.save(member));

        return OauthMemberResponse.from(saved);
    }
}
