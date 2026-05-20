package com.banghyang.object.cart.controller;

import com.banghyang.member.entity.Member;
import com.banghyang.object.cart.dto.CartRequest;
import com.banghyang.object.cart.service.CartService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RequestMapping("/cart")
@RestController
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;


    /**
     * 장바구니에 제품 추가
     * @param cartRequest 장바구니 추가 요청 정보
     * @return 성공 여부 응답
     */
    @PostMapping
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartRequest cartRequest) {

        Long memberId = cartRequest.getMemberId();
        Long productId = cartRequest.getProductId();
        int quantity = cartRequest.getQuantity();

        log.info("👍 [장바구니에 추가 요청] memberId={}, productId={}, quantity={}",
                memberId, productId, quantity);

        try {
            cartService.addToCart(memberId, productId, quantity);
            log.info("✅ [장바구니에 추가 성공] memberId={}, productId={}, quantity={}",
                    memberId, productId, quantity);
            return ResponseEntity.ok().body("장바구니에 정상적으로 추가되었습니다.");
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            log.error("❌ [장바구니에 추가 실패] {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 장바구니에 있는 제품 삭제
     * @param memberId 장바구니에 있는 제품을 삭제하는 사용자 ID
     * @param productId 장바구니에 있는 제품 ID
     * @return 삭제 성공 여부 응답
     */
    @DeleteMapping("/{memberId}/{productId}")
    public ResponseEntity<?> deleteToCart(@PathVariable("memberId") Long memberId,
                                        @PathVariable("productId") Long productId) {

        log.info("🗑️ [장바구니에 있는 제품 삭제 요청] memberId={}, productId={}", memberId, productId);

        if (memberId == null || productId == null) {
            log.error("❌ memberId 또는 productId가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body("memberId 또는 productId가 null입니다.");
        }

        boolean isDeleted =cartService.deleteToCart(memberId, productId);

        if (isDeleted) {
            log.info("✅ [장바구니에 있는 제품 삭제 완료] memberId={}, productId={}", memberId, productId);
            return ResponseEntity.ok().body("장바구니에 있는 제품이 정상적으로 삭제되었습니다.");
        } else {
            log.warn("⚠️ [장바구니에 있는 제품 삭제 실패] memberId={}, productId={}에 대한 장바구니에 있는 제품 데이터가 존재하지 않습니다.", memberId, productId);
            return ResponseEntity.badRequest().body("장바구니에 있는 제품 데이터가 존재하지 않아 삭제할 수 없습니다.");
        }
    }


    /**
     * ✅ 장바구니 전체 삭제 요청 (DELETE)
     * @param memberId 장바구니 삭제를 하는 사용자 ID
     * @return 삭제 성공 여부 응답
     */
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> allDeleteCart(@PathVariable("memberId") Member memberId) {
        log.info("🗑️ [장바구니 전체 삭제 요청] memberId={}", memberId);

        if (memberId == null) {
            log.error("❌ memberId 가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body("memberId가 null입니다.");
        }

        boolean isDeleted = cartService.deleteAllCart(memberId);

        if (isDeleted) {
            log.info("✅ [장바구니 전체 삭제 완료] memberId={}", memberId);
            return ResponseEntity.ok().body("장바구니가 정상적으로 전체 삭제되었습니다.");
        } else {
            log.warn("⚠️ [장바구니 전체 삭제 실패] memberId={}에 대한 장바구니 데이터가 존재하지 않습니다.", memberId);
            return ResponseEntity.badRequest().body("장바구니 데이터가 존재하지 않아 삭제할 수 없습니다.");
        }
    }


    /**
     * 장바구니에 있는 제품 개수 수정
     * @param cartRequest 장바구니 추가 요청 정보
     * @return 삭제 성공 여부 응답
     */
    @PutMapping
    public ResponseEntity<?> updateToCart( @RequestBody CartRequest cartRequest) {

        Long memberId = cartRequest.getMemberId();
        Long productId = cartRequest.getProductId();
        int quantity = cartRequest.getQuantity();

        log.info("👍 [장바구니 수량 수정 요청] memberId={}, productId={}, quantity={}",
                memberId, productId, quantity);

        try {
            cartService.updateCartQuantity(memberId, productId, quantity);
            log.info("✅ [장바구니 수량 수정 성공] memberId={}, productId={}, quantity={}",
                    memberId, productId, quantity);
            return ResponseEntity.ok().body("장바구니 수량이 정상적으로 수정되었습니다.");
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            log.error("❌ [장바구니 수량 수정 실패] {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    /**
     * 장바구니 목록을 조회
     * 장바구니에 등록한 향수의 상세 정보(이름, 브랜드, 가격, 이미지정보 등)와 총 개수를 반환
     *
     * @param memberId 조회할 사용자의 ID
     * @return 장바구니에 등록한 향수 목록과 총 개수를 포함한 Map 형태의 응답
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getCart(@PathVariable("memberId") Long memberId) {
        log.info("🔍 [장바구니 조회 요청] memberId={}", memberId);

        if (memberId == null) {
            log.error("❌ memberId가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body(Map.of("error", "memberId가 null입니다."));
        }

        try {
            Map<String, Object> response = cartService.getCart(memberId);

            // 간단하게 totalCount만 로그
            log.info("✅ [장바구니 조회 성공] memberId={} 장바구니에 들어간 제품 개수: {}", memberId, response.get("totalCount"));

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("❌ [장바구니 조회 실패] {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
