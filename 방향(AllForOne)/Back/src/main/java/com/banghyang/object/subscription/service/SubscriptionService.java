package com.banghyang.object.subscription.service;

import com.banghyang.member.entity.Member;
import com.banghyang.member.repository.MemberRepository;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.repository.ProductRepository;
import com.banghyang.object.subscription.dto.SubscriptionResponse;
import com.banghyang.object.subscription.entity.Subscription;
import com.banghyang.object.subscription.repository.SubscriptionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor

public class SubscriptionService {


    private final SubscriptionRepository subscriptionRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;


    /**
     * 구독 생성
     * 회원이 특정 상품을 구독할 때 호출되는 메서드
     * categoryId가 4인 상품만 구독 가능하며, 중복 구독은 불가능함
     * @param memberId 구독을 생성할 회원의 ID
     * @param productId 구독할 상품의 ID (categoryId가 4여야 함)
     * @return 생성된 구독 정보를 담은 SubscriptionResponse
     */
    public SubscriptionResponse subscribe(Long memberId, Long productId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다. ID: " + memberId));

        Product product = productRepository.findByIdAndCategoryId(productId, 4L)
                .orElseThrow(() -> new IllegalArgumentException("구독 가능한 상품을 찾을 수 없습니다. ID: " + productId));

        // 기존 구독(활성/비활성 모두) 조회로 변경
        Optional<Subscription> existingSubscription = subscriptionRepository
                .findByMemberAndProduct(member, product);

        if (existingSubscription.isPresent()) {
            Subscription subscription = existingSubscription.get();

            // 활성 구독이면 에러
            if (subscription.isActive()) {
                throw new IllegalStateException("이미 구독 중인 상품입니다");
            }

            // 취소된 구독이면 재활성화
            subscription.reactivate();
            Subscription savedSubscription = subscriptionRepository.save(subscription);
            return SubscriptionResponse.from(savedSubscription);
        }

        // 처음 구독하는 경우에만 새로 생성
        Subscription subscription = Subscription.create(member, product);
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        return SubscriptionResponse.from(savedSubscription);

    }



    /**
     * 구독 취소
     * 활성 상태인 구독을 취소하고 취소 시간을 기록함
     *
     * @param subscriptionId 취소할 구독의 ID
     * @param memberId 구독 취소를 요청한 회원의 ID
     * @throws IllegalArgumentException 구독을 찾을 수 없거나 본인의 구독이 아닌 경우
     * @throws IllegalStateException 이미 취소된 구독인 경우
     */
    public void cancelSubscription(Long subscriptionId, Long memberId) {

        // 구독 존재 여부 확인
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("구독을 찾을 수 없습니다. ID: " + subscriptionId));

        // 본인의 구독인지 확인
        if (!subscription.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 구독만 취소할 수 있습니다");
        }

        // 이미 취소된 구독인지 확인
        if (!subscription.isActive()) {
            throw new IllegalStateException("이미 취소된 구독입니다");
        }

        // 구독 취소 처리 (canceledAt 필드에 현재 시간 설정)
        subscription.cancel();

        // 변경사항 저장
        subscriptionRepository.save(subscription);
    }


    /**
     * 내 구독 목록 조회 (전체 - 활성/취소 모두)
     * 구독 관리 페이지에서 사용, 취소된 구독도 함께 반환하여 재구독 가능하게 함
     *
     * @param memberId 조회할 회원의 ID
     * @return 전체 구독 이력을 SubscriptionResponse 리스트로 반환 (최신순)
     */
    @Transactional
    public List<SubscriptionResponse> getMyAllSubscriptions(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다. ID: " + memberId));

        // 회원의 모든 구독 목록 조회 (최신순 정렬)
        List<Subscription> allSubscriptions = subscriptionRepository
                .findByMemberOrderBySubscribedAtDesc(member);

        return allSubscriptions.stream()
                .map(SubscriptionResponse::from)
                .collect(Collectors.toList());
    }
}
