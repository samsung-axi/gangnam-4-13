package com.banghyang.object.bookmark.controller;

import com.banghyang.object.bookmark.service.BookmarkService;
import com.banghyang.object.bookmark.dto.BookmarkedPerfumeResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookmarks")
@RequiredArgsConstructor
@Slf4j
public class BookmarkController {

    private final BookmarkService bookmarkService;

    /**
     * 특정 향수를 북마크 추가/삭제 (더블 클릭)
     */
    @PostMapping("/{productId}/{memberId}")
    public ResponseEntity<Map<String, Boolean>> toggleBookmark(
            @PathVariable Long productId,
            @PathVariable Long memberId 
    ) {
        boolean isBookmarked = bookmarkService.toggleBookmark(productId, memberId);
        return ResponseEntity.ok(Map.of("isBookmarked", isBookmarked));
    }

    /**
     * 사용자가 북마크한 향수 리스트 조회 + 유사 향수 함께 조회
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<Map<String, Object>> getBookmarkedPerfumes(
            @PathVariable Long memberId
    ) {
        Map<String, Object> response = bookmarkService.getBookmarkedPerfumes(memberId);
        return ResponseEntity.ok(response);
    }

    /**
     * 북마크 개별 삭제 (X 버튼 클릭)
     */
    @DeleteMapping("/{productId}/{memberId}")
    public ResponseEntity<Void> deleteBookmark(
            @PathVariable Long productId,
            @PathVariable Long memberId
    ) {
        bookmarkService.deleteBookmark(memberId, productId);
        return ResponseEntity.ok().build();
    }
}
