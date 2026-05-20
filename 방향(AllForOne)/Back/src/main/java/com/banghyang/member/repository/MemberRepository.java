package com.banghyang.member.repository;

import com.banghyang.auth.kakao.model.dto.OauthId;
import com.banghyang.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByOauthId(OauthId oauthId);
}
