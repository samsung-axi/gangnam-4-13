package com.banghyang.object.wishlist.service;

import com.banghyang.common.type.NoteType;
import com.banghyang.member.entity.Member;
import com.banghyang.member.repository.MemberRepository;
import com.banghyang.object.cart.entity.Cart;
import com.banghyang.object.cart.repository.CartRepository;
import com.banghyang.object.note.entity.Note;
import com.banghyang.object.note.repository.NoteRepository;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import com.banghyang.object.product.repository.ProductRepository;
import com.banghyang.object.wishlist.dto.WishlistResponse;
import com.banghyang.object.wishlist.entity.Wishlist;
import com.banghyang.object.wishlist.repository.WishlistRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor

public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final NoteRepository noteRepository;
    private final CartRepository cartRepository;


    /**
     * 찜 추가 메소드
     */
    public void createWish(Long memberId, Long productId) {

        if (memberId == null || productId == null) {
            throw new IllegalArgumentException("❌ memberId 또는 productId가 null입니다. 요청을 확인하세요.");
        }

        // 찜 누른 사용자 찾기
        Member targetMemberEntity = memberRepository.findById(memberId).orElseThrow(() ->
                new EntityNotFoundException("[찜-서비스-생성] 아이디에 해당하는 멤버 엔티티를 찾을 수 없습니다. ID: " + memberId));

        // 찜 누른 제품 찾기
        Product targetProductEntity = productRepository.findById(productId).orElseThrow(() ->
                new EntityNotFoundException("[찜-서비스-생성] 아이디에 해당하는 제품 엔티티를 찾을 수 없습니다. ID: " + productId));

        // 찜 엔티티 생성 및 저장
        Wishlist wishlist = Wishlist.builder()
                .member(targetMemberEntity)
                .product(targetProductEntity)
                .build();

        wishlistRepository.save(wishlist);
    }


    /**
     * 찜 삭제 메소드
     * @param memberId 찜 삭제하는 사용자 id
     * @param productId 찜 삭제할 제품 id
     * @return 찜 삭제 완료 여부 반환
     */
    public boolean deleteWish(Long memberId, Long productId) {
        if (memberId == null || productId == null) {
            log.error("❌ [찜 삭제] memberId 또는 productId가 null입니다!");
            throw new IllegalArgumentException("memberId 또는 productId가 null입니다.");
        }

        log.info("🗑️ [찜 삭제] memberId={}, productId={} 삭제 요청 처리 중...", memberId, productId);

        // 찜 엔티티 찾기
        List<Wishlist> wishesToDelete = wishlistRepository.findByMemberIdAndProductId(memberId, productId);

        if (!wishesToDelete.isEmpty()) {
            wishlistRepository.deleteAll(wishesToDelete);
            log.info("✅ [찜 삭제 완료] memberId={}, productId={} 삭제된 개수: {}", memberId, productId, wishesToDelete.size());
            return true;
        } else {
            log.warn("⚠️ [찜 삭제 실패] memberId={}, productId={}에 대한 찜 데이터가 존재하지 않습니다.", memberId, productId);
            return false;
        }
    }


    /**
     * 찜 전체 삭제 메소드
     * @param memberId 찜 삭제하는 사용자 id
     * @return 찜 삭제 완료 여부 반환
     */
    public boolean deleteAllWish(Member memberId) {
        if (memberId == null) {
            log.error("❌ [찜 삭제] memberId가 null입니다!");
            throw new IllegalArgumentException("memberId 또는 productId가 null입니다.");
        }

        log.info("🗑️ [찜 전체 삭제] memberId={} 삭제 요청 처리 중...", memberId);

        // 찜 엔티티 찾기
        List<Wishlist> wishesToDelete = wishlistRepository.findByMember(memberId);

        if (!wishesToDelete.isEmpty()) {
            wishlistRepository.deleteAll(wishesToDelete);
            log.info("✅ [찜 삭제 완료] memberId={},삭제된 개수: {}", memberId, wishesToDelete.size());
            return true;
        } else {
            log.warn("⚠️ [찜 삭제 실패] memberId={}에 대한 찜 데이터가 존재하지 않습니다.", memberId);
            return false;
        }
    }


    /**
     * 회원의 찜 목록을 조회하여 향수 상세 정보를 반환
     *
     * @param memberId 조회할 회원의 ID
     * @return 찜한 향수 목록과 총 개수를 포함한 Map
     *         - "wishlist": 찜한 향수 상세 정보 리스트
     *         - "totalCount": 찜한 향수 총 개수
     */
    public Map<String, Object> getWishes(Long memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("memberId가 null입니다.");
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<Wishlist> wishlists = wishlistRepository.findByMember(member);

        List<WishlistResponse> wishedPerfumes = wishlists.stream()
                .map(wishlist -> {
                    Product product = wishlist.getProduct();
                    List<String> imageUrls = productImageRepository.findByProduct(product)
                            .stream()
                            .map(ProductImage::getUrl)
                            .toList();

                    List<Note> notes = noteRepository.findByProduct(product);
                    Map<NoteType, String> noteMap = notes.stream()
                            .collect(Collectors.groupingBy(
                                    Note::getNoteType,
                                    Collectors.mapping(
                                            note -> note.getSpice().getNameKr(),
                                            Collectors.joining(", ")
                                    )
                            ));

                    String singleNote = noteMap.getOrDefault(NoteType.SINGLE, "");
                    String topNote = noteMap.getOrDefault(NoteType.TOP, "");
                    String middleNote = noteMap.getOrDefault(NoteType.MIDDLE, "");
                    String baseNote = noteMap.getOrDefault(NoteType.BASE, "");

                    return new WishlistResponse(product, imageUrls, singleNote, topNote, middleNote, baseNote);
                })
                .toList();

        return Map.of(
                "wishlist", wishedPerfumes,
                "totalCount", wishedPerfumes.size()
        );
    }



    /**
     * 찜 상품을 장바구니에 추가
     */
    public void moveWishToCart(Long memberId) {

        if (memberId == null) {
            throw new IllegalArgumentException("❌ memberId가 null입니다. 요청을 확인하세요.");
        }

        // 찜 누른 사용자 찾기
        Member targetMemberEntity = memberRepository.findById(memberId).orElseThrow(() ->
                new EntityNotFoundException("[찜-서비스-생성] 아이디에 해당하는 멤버 엔티티를 찾을 수 없습니다. ID: " + memberId));

        // 해당 회원의 모든 찜 목록 조회
        List<Wishlist> wishlistItems = wishlistRepository.findByMember(targetMemberEntity);

        if (wishlistItems.isEmpty()) {
            throw new IllegalStateException("이동할 찜 상품이 없습니다.");
        }

        // 2. 찜 목록을 장바구니로 이동
        for (Wishlist wishItem : wishlistItems) {
            // 이미 장바구니에 있는지 확인
            Optional<Cart> existingCart = cartRepository.findByMemberAndProduct(
                    targetMemberEntity, wishItem.getProduct()
            );

            if (existingCart.isPresent()) {
                // 이미 있으면 수량 증가
                Cart cart = existingCart.get();
                cart.setQuantity(cart.getQuantity() + 1);
                cartRepository.save(cart);
            } else {
                // 없으면 새로 장바구니에 추가
                Cart cart = Cart.builder()
                        .member(targetMemberEntity)
                        .product(wishItem.getProduct())
                        .quantity(1)
                        .build();
                cartRepository.save(cart);
            }
        }
    }

}
