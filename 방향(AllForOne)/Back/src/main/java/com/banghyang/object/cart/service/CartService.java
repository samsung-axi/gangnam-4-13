package com.banghyang.object.cart.service;

import com.banghyang.member.entity.Member;
import com.banghyang.member.repository.MemberRepository;
import com.banghyang.object.cart.dto.CartResponse;
import com.banghyang.object.cart.entity.Cart;
import com.banghyang.object.cart.repository.CartRepository;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import com.banghyang.object.product.repository.ProductRepository;
import com.banghyang.object.wishlist.entity.Wishlist;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final ProductImageRepository productImageRepository;


    /**
     * 장바구니에 제품 추가 메소드
     */
    public void addToCart(Long memberId, Long productId, int quantity) {

        if (memberId == null || productId == null) {
            throw new IllegalArgumentException("❌ memberId 또는 productId가 null입니다. 요청을 확인하세요.");
        }

        // 장바구니 추가 누른 사용자 찾기
        Member targetMemberEntity = memberRepository.findById(memberId).orElseThrow(() ->
                new EntityNotFoundException("[장바구니-서비스-생성] 아이디에 해당하는 멤버 엔티티를 찾을 수 없습니다. ID: " + memberId));

        // 장바구니 추가 누른 제품 찾기
        Product targetProductEntity = productRepository.findById(productId).orElseThrow(() ->
                new EntityNotFoundException("[장바구니-서비스-생성] 아이디에 해당하는 제품 엔티티를 찾을 수 없습니다. ID: " + productId));

        // 기존 장바구니 아이템 확인 (여기에 추가!)
        Optional<Cart> existingCart = cartRepository.findByMemberIdAndProductId(memberId, productId);

        if (existingCart.isPresent()) {
            // 이미 있으면 수량 증가
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + quantity);
            cartRepository.save(cart);
            log.info("기존 장바구니 아이템 수량 증가: {} -> {}",
                    cart.getQuantity() - quantity, cart.getQuantity());
        } else {
            // 없으면 새로 추가
            Cart cart = Cart.builder()
                    .member(targetMemberEntity)
                    .product(targetProductEntity)
                    .quantity(quantity)
                    .build();

            cartRepository.save(cart);
            log.info("새 장바구니 아이템 추가: quantity={}", quantity);
        }
    }


    /**
     * 장바구니에 있는 제품 삭제
     * @param memberId 장바구니에 있는 제품을 삭제하는 사용자 ID
     * @param productId 장바구니에 있는 제품 ID
     * @return 삭제 성공 여부 응답
     */
    public boolean deleteToCart(Long memberId, Long productId) {
        if (memberId == null || productId == null) {
            log.error("❌ [장바구니에 있는 제품 삭제] memberId 또는 productId가 null입니다!");
            throw new IllegalArgumentException("memberId 또는 productId가 null입니다.");
        }

        log.info("🗑️ [장바구니에 있는 제품 삭제] memberId={}, productId={} 삭제 요청 처리 중...", memberId, productId);

        // 장바구니 제품 엔티티 찾기
        Optional<Cart> deleteToCart = cartRepository.findByMemberIdAndProductId(memberId, productId);

        // 삭제된 개수
        int deletedCount = 0;
        if (deleteToCart.isPresent()) {
            cartRepository.delete(deleteToCart.get());
            deletedCount = 1;
        }

        if (!deleteToCart.isEmpty()) {
            cartRepository.delete(deleteToCart.get());
            log.info("✅ [장바구니에 있는 제품 삭제 완료] memberId={}, productId={} 삭제된 개수: {}", memberId, productId, deletedCount);
            return true;
        } else {
            log.warn("⚠️ [장바구니에 있는 제품 삭제 실패] memberId={}, productId={}에 대한 장바구니 데이터가 존재하지 않습니다.", memberId, productId);
            return false;
        }
    }



    /**
     * 장바구니 전체 삭제 메소드
     * @param memberId 장바구니 삭제하는 사용자 id
     * @return 장바구니 삭제 완료 여부 반환
     */
    public boolean deleteAllCart(Member memberId) {
        if (memberId == null) {
            log.error("❌ [장바구니 삭제] memberId가 null입니다!");
            throw new IllegalArgumentException("memberId 또는 productId가 null입니다.");
        }

        log.info("🗑️ [장바구니 전체 삭제] memberId={} 삭제 요청 처리 중...", memberId);

        // 장바구니 엔티티 찾기
        List<Cart> cartsToDelete = cartRepository.findByMember(memberId);

        if (!cartsToDelete.isEmpty()) {
            cartRepository.deleteAll(cartsToDelete);
            log.info("✅ [장바구니 삭제 완료] memberId={},삭제된 개수: {}", memberId, cartsToDelete.size());
            return true;
        } else {
            log.warn("⚠️ [장바구니 삭제 실패] memberId={}에 대한 장바구니 데이터가 존재하지 않습니다.", memberId);
            return false;
        }
    }



    /**
     * 장바구니 상품 수량 수정 메소드
     */
    public void updateCartQuantity(Long memberId, Long productId, int quantity) {

        if (memberId == null || productId == null) {
            throw new IllegalArgumentException("❌ memberId 또는 productId가 null입니다. 요청을 확인하세요.");
        }

        if (quantity < 1) {
            throw new IllegalArgumentException("❌ 수량은 1개 이상이어야 합니다.");
        }

        // 해당 회원과 상품으로 장바구니 아이템 찾기
        Cart existingCart = cartRepository.findByMemberIdAndProductId(memberId, productId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "[장바구니-서비스-수정] 해당 회원의 장바구니에서 상품을 찾을 수 없습니다. memberId: " + memberId + ", productId: " + productId));

        // 수량 업데이트
        existingCart.setQuantity(quantity);

        // 저장
        cartRepository.save(existingCart);
    }


    /**
     * 회원의 장바구니 목록을 조회하여 향수 상세 정보를 반환
     *
     * @param memberId 조회할 회원의 ID
     * @return 장바구니에 넣은 향수 목록과 총 개수를 포함한 Map
     *         - "cart": 장바구니에 넣음 제품 리스트
     *         - "totalCount": 장바구니에 들어있는 향수 총 개수
     */
    public Map<String, Object> getCart(Long memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("memberId가 null입니다.");
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<Cart> carts = cartRepository.findByMember(member);

        List<CartResponse> CartList = carts.stream()
                .map(cart -> {
                    Product product = cart.getProduct();
                    List<String> imageUrls = productImageRepository.findByProduct(product)
                            .stream()
                            .map(ProductImage::getUrl)
                            .toList();


                    return new CartResponse(product, imageUrls,cart.getQuantity());
                })
                .toList();

        return Map.of(
                "cart", CartList,
                "totalCount", CartList.size()
        );
    }
}
