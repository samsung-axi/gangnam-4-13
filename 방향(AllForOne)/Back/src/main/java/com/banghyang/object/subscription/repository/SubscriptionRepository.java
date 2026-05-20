package com.banghyang.object.subscription.repository;

import com.banghyang.member.entity.Member;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // 회원의 전체 구독 목록 (최신순)
    List<Subscription> findByMemberOrderBySubscribedAtDesc(Member member);

    // 회원의 기존 구독(활성/비활성 모두) 조회
    Optional<Subscription> findByMemberAndProduct(Member member, Product product);
}
