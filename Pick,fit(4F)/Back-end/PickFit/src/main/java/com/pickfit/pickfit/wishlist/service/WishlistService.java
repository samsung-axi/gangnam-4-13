package com.pickfit.pickfit.wishlist.service;

import com.pickfit.pickfit.wishlist.dto.WishlistDto;
import com.pickfit.pickfit.wishlist.entity.WishlistEntity;
import com.pickfit.pickfit.wishlist.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public WishlistService(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    public List<WishlistEntity> getWishlist(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("유효하지 않은 사용자 이메일입니다.");
        }

        // 상태 필터링 - isDeleted가 false인 데이터만 반환
        List<WishlistEntity> allWishlist = wishlistRepository.findByUserEmail(userEmail);
        return allWishlist.stream()
                .filter(wishlist -> !wishlist.isDeleted()) // 상태가 false인 항목만 필터링
                .collect(Collectors.toList());
    }
    @Transactional
    public WishlistEntity addToWishlist(WishlistDto wishlistDto) {
        if (wishlistDto == null) {
            throw new IllegalArgumentException("위시리스트 요청 데이터가 비어 있습니다.");
        }

        // 유효성 검사
        if (wishlistDto.getUserEmail() == null || wishlistDto.getUserEmail().isEmpty()) {
            throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
        }
        if (wishlistDto.getProductId() == null) {
            throw new IllegalArgumentException("상품 ID가 누락되었습니다.");
        }

        // 기존 데이터 조회
        Optional<WishlistEntity> optionalProduct = wishlistRepository.findByProductIdAndUserEmail(
                wishlistDto.getProductId(),
                wishlistDto.getUserEmail()
        );

        if (optionalProduct.isPresent()) {
            WishlistEntity existingProduct = optionalProduct.get();

            if (existingProduct.isDeleted()) {
                // 기존 데이터가 삭제 상태라면 복구
                existingProduct.setDeleted(false);
                existingProduct.setImageUrl(wishlistDto.getImageUrl());
                existingProduct.setUserName(wishlistDto.getUserName());
                existingProduct.setPrice(wishlistDto.getPrice());
                existingProduct.setTitle(wishlistDto.getTitle());
                return wishlistRepository.save(existingProduct);
            } else {
                // 이미 활성화된 상태면 예외 처리
                throw new IllegalStateException("이미 활성 상태로 등록된 위시리스트 항목입니다.");
            }
        }

        // 새 데이터 생성
        WishlistEntity newProduct = new WishlistEntity();
        newProduct.setUserEmail(wishlistDto.getUserEmail());
        newProduct.setImageUrl(wishlistDto.getImageUrl());
        newProduct.setUserName(wishlistDto.getUserName());
        newProduct.setPrice(wishlistDto.getPrice());
        newProduct.setProductId(wishlistDto.getProductId());
        newProduct.setTitle(wishlistDto.getTitle());
        newProduct.setDeleted(false); // 새 데이터는 기본적으로 활성 상태

        return wishlistRepository.save(newProduct);
    }



    public boolean softDeleteProduct(String userEmail, Long productId) {
        Optional<WishlistEntity> optionalProduct = wishlistRepository.findByProductIdAndUserEmail(productId, userEmail);

        if (optionalProduct.isEmpty()) {
            return false; // 제품이 존재하지 않거나 조건 불일치
        }

        WishlistEntity wishlistEntity = optionalProduct.get();

        // 상태 값 변경
        wishlistEntity.setDeleted(true); // 예: 'deleted' 상태를 true로 설정
        wishlistRepository.save(wishlistEntity);

        return true;
    }

}
