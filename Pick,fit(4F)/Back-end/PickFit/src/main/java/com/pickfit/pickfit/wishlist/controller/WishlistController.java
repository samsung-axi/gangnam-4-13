package com.pickfit.pickfit.wishlist.controller;

import com.pickfit.pickfit.wishlist.dto.WishlistDto;
import com.pickfit.pickfit.wishlist.entity.WishlistEntity;
import com.pickfit.pickfit.wishlist.service.WishlistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userEmail}")
    public ResponseEntity<Map<String, Object>> getWishlist(@PathVariable String userEmail) {
        Map<String, Object> response = new HashMap<>();

        if (userEmail == null || userEmail.trim().isEmpty()) {
            response.put("error", "유효하지 않은 사용자 이메일입니다.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            List<WishlistEntity> wishlist = wishlistService.getWishlist(userEmail);

            if (wishlist.isEmpty()) {
                response.put("message", "위시리스트가 비어 있습니다.");
                response.put("data", Collections.emptyList());
            } else {
                response.put("data", wishlist);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("위시리스트를 불러오는 중 오류 발생: {}", e.getMessage(), e);
            response.put("error", "위시리스트를 불러오는 데 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping
    public ResponseEntity<Map<String, String>> addToWishlist(@RequestBody WishlistDto request) {
        Map<String, String> response = new HashMap<>();
        try {
            // 필수 값 검증
            if (request.getUserEmail() == null || request.getUserEmail().isEmpty() ||
                    request.getProductId() == null ||
                    request.getImageUrl() == null || request.getImageUrl().isEmpty() ||
                    request.getTitle() == null || request.getTitle().isEmpty()) {
                response.put("error", "필수 값이 누락되었습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 서비스 호출
            wishlistService.addToWishlist(request);
            response.put("message", "상품이 위시리스트에 추가되었거나 복구되었습니다.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 서비스 레이어에서 유효성 검사 실패
            response.put("error", "잘못된 입력값입니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (IllegalStateException e) {
            // 이미 활성 상태인 데이터에 대한 예외 처리
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (RuntimeException e) {
            // 예상치 못한 비즈니스 로직 오류
            response.put("error", "위시리스트에 상품을 추가하는 중 문제가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            // 시스템 오류 또는 기타 예외
            response.put("error", "알 수 없는 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long productId,
            @RequestParam String userEmail) {

        // 디버깅을 위해 출력 로그 확인
        System.out.println("Received request: userEmail = " + userEmail + ", productId = " + productId);

        boolean isUpdated = wishlistService.softDeleteProduct(userEmail, productId);

        if (isUpdated) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found or unauthorized.");
    }

}
