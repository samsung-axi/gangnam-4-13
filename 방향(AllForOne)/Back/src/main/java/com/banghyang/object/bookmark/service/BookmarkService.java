package com.banghyang.object.bookmark.service;

import com.banghyang.member.entity.Member;
import com.banghyang.member.repository.MemberRepository;
import com.banghyang.object.bookmark.dto.BookmarkedPerfumeResponse;
import com.banghyang.object.bookmark.entity.Bookmark;
import com.banghyang.object.bookmark.repository.BookmarkRepository;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import com.banghyang.object.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final WebClient webClient;

    /**
     * 북마크 추가/삭제 메소드
     *
     * @param memberId  회원 ID
     * @param productId 제품 ID
     * @return 북마크 추가 시 true, 삭제 시 false 반환
     */
    public boolean toggleBookmark(Long productId ,Long memberId ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 제품입니다."));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByMemberAndProduct(member, product);
        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get()); // 북마크 삭제
            return false;
        } else {
            Bookmark newBookmark = Bookmark.builder()
                    .member(member)
                    .product(product)
                    .build();
            bookmarkRepository.save(newBookmark); // 북마크 추가
            return true;
        }
    }

    /**
     * 북마크한 향수 목록 조회 + 유사 향수 추천
     *
     * @param memberId 회원 ID
     * @return 북마크한 향수 목록 + 유사 향수 추천
     */
    public Map<String, Object> getBookmarkedPerfumes(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<Bookmark> bookmarks = bookmarkRepository.findByMember(member);


        // 북마크한 향수 리스트
        List<BookmarkedPerfumeResponse> bookmarkedPerfumes = bookmarks.stream()
                .map(bookmark -> {
                    Product product = bookmark.getProduct();
                    List<String> imageUrls = productImageRepository.findByProduct(product)
                            .stream()
                            .map(ProductImage::getUrl)
                            .toList(); // Java 17+에서는 toList() 사용
                    return new BookmarkedPerfumeResponse(product, imageUrls);
                })
                .toList();

        // FastAPI에서 유사 향수 추천 받기
        List<Map<String, Object>> recommendedPerfumes = getRecommendedPerfumes(memberId);

        return Map.of(
                "bookmarkedPerfumes", bookmarkedPerfumes,
                "recommendedPerfumes", recommendedPerfumes
        );
    }

    /**
     * FastAPI로부터 향수 추천 데이터를 가져오는 메소드
     *
     * @param memberId 회원 ID
     * @return 추천 향수 목록
     */
    private List<Map<String, Object>> getRecommendedPerfumes(Long memberId) {
        try {
            return webClient
                    .get()
                    .uri("http://localhost:8000/bookmark/" + memberId) // FastAPI 서버 엔드포인트 호출
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block(); // 동기 처리 (비동기 처리 필요하면 .subscribe() 사용)
        } catch (Exception e) {
            throw new RuntimeException("FastAPI 추천 시스템 호출 중 오류 발생: " + e.getMessage());
        }
    }

    /**
     * 북마크 삭제 메소드
     *
     * @param memberId  회원 ID
     * @param productId 제품 ID
     */
    public void deleteBookmark(Long memberId, Long productId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 제품입니다."));

        Bookmark bookmark = bookmarkRepository.findByMemberAndProduct(member, product)
                .orElseThrow(() -> new IllegalArgumentException("북마크된 제품이 아닙니다."));

        bookmarkRepository.delete(bookmark);
    }
}