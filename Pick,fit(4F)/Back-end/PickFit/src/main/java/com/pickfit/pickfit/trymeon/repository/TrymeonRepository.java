package com.pickfit.pickfit.trymeon.repository;

import org.springframework.data.jpa.repository.JpaRepository; // JPA 기본 레포지토리 인터페이스 가져오기
import org.springframework.stereotype.Repository; // 스프링에서 레포지토리로 선언
import com.pickfit.pickfit.trymeon.entity.TrymeonEntity; // 엔티티 클래스 가져오기

import java.util.List; // 리스트 타입 사용

@Repository // 레포지토리 어노테이션 추가
public interface TrymeonRepository extends JpaRepository<TrymeonEntity, Long> {

    // 특정 사용자 이메일과 상품 ID로 삭제되지 않은 데이터를 검색
    TrymeonEntity findByUserEmailAndProductIdAndDeletedFalse(String userEmail, Long productId);

    // 삭제되지 않은 모든 데이터를 검색
    List<TrymeonEntity> findAllByDeletedFalse();
}
