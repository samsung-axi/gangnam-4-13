package com.banghyang.object.wishlist.controller;

import com.banghyang.member.entity.Member;
import com.banghyang.object.wishlist.dto.MoveToCartRequest;
import com.banghyang.object.wishlist.dto.WishlistRequest;
import com.banghyang.object.wishlist.service.WishlistService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RequestMapping("/wishlist")
@RestController
@RequiredArgsConstructor

public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * 찜 추가
     */
    @PostMapping
    public ResponseEntity<?> createWish(@RequestBody WishlistRequest wishlistRequest) {

        Long memberId = wishlistRequest.getMemberId();
        Long productId = wishlistRequest.getProductId();

        log.info("👍 [찜 요청] memberId={}, productId={}", memberId, productId);

        try {
            wishlistService.createWish(memberId, productId);
            log.info("✅ [찜 성공] memberId={}, productId={}", memberId, productId);
            return ResponseEntity.ok().body("찜이 정상적으로 추가되었습니다.");
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            log.error("❌ [찜 실패] {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ✅ 찜 삭제 요청 (DELETE)
     * @param memberId 찜 삭제를 하는 사용자 ID
     * @param productId 찜 삭제를 할 제품 ID
     * @return 삭제 성공 여부 응답
     */
    @DeleteMapping("/{memberId}/{productId}")
    public ResponseEntity<?> deleteWish(@PathVariable("memberId") Long memberId,
                                        @PathVariable("productId") Long productId) {
        log.info("🗑️ [찜 삭제 요청] memberId={}, productId={}", memberId, productId);

        if (memberId == null || productId == null) {
            log.error("❌ memberId 또는 productId가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body("memberId 또는 productId가 null입니다.");
        }

        boolean isDeleted = wishlistService.deleteWish(memberId, productId);

        if (isDeleted) {
            log.info("✅ [찜 삭제 완료] memberId={}, productId={}", memberId, productId);
            return ResponseEntity.ok().body("찜이 정상적으로 삭제되었습니다.");
        } else {
            log.warn("⚠️ [찜 삭제 실패] memberId={}, productId={}에 대한 찜 데이터가 존재하지 않습니다.", memberId, productId);
            return ResponseEntity.badRequest().body("찜 데이터가 존재하지 않아 삭제할 수 없습니다.");
        }
    }


    /**
     * ✅ 찜 전체 삭제 요청 (DELETE)
     * @param memberId 찜 삭제를 하는 사용자 ID
     * @return 삭제 성공 여부 응답
     */
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> allDeleteWish(@PathVariable("memberId") Member memberId) {
        log.info("🗑️ [찜 전체 삭제 요청] memberId={}", memberId);

        if (memberId == null) {
            log.error("❌ memberId 가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body("memberId가 null입니다.");
        }

        boolean isDeleted = wishlistService.deleteAllWish(memberId);

        if (isDeleted) {
            log.info("✅ [찜 전체 삭제 완료] memberId={}", memberId);
            return ResponseEntity.ok().body("찜이 정상적으로 전체 삭제되었습니다.");
        } else {
            log.warn("⚠️ [찜 전체 삭제 실패] memberId={}에 대한 찜 데이터가 존재하지 않습니다.", memberId);
            return ResponseEntity.badRequest().body("찜 데이터가 존재하지 않아 삭제할 수 없습니다.");
        }
    }


    /**
     * 찜 목록을 조회
     * 찜한 향수의 상세 정보(이름, 브랜드, 가격, 이미지, 노트 정보 등)와 총 개수를 반환
     *
     * @param memberId 조회할 사용자의 ID
     * @return 찜한 향수 목록과 총 개수를 포함한 Map 형태의 응답
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getWishedProducts(@PathVariable("memberId") Long memberId) {
        log.info("🔍 [찜 조회 요청] memberId={}", memberId);

        if (memberId == null) {
            log.error("❌ memberId가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body(Map.of("error", "memberId가 null입니다."));
        }

        try {
            Map<String, Object> response = wishlistService.getWishes(memberId);

            // 간단하게 totalCount만 로그
            log.info("✅ [찜 조회 성공] memberId={} 찜한 제품 개수: {}", memberId, response.get("totalCount"));

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("❌ [찜 조회 실패] {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    /**
     * 찜한 상품 전체를 장바구니에 추가
     */
    @PostMapping("/cart")
    public ResponseEntity<?> moveWishToCart(@RequestBody MoveToCartRequest moveToCartRequest) {

        Long memberId = moveToCartRequest.getMemberId();

        log.info("👍 [찜상품 장바구니에 요청] memberId={}", memberId);

        try {
            wishlistService.moveWishToCart(memberId);
            log.info("✅ [찜상품 장바구니 추가 성공] memberId={}", memberId);
            return ResponseEntity.ok().body("찜 상품이 정상적으로 장바구니에 추가되었습니다.");
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            log.error("❌ [찜상품 장바구니에 추가 실패] {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
