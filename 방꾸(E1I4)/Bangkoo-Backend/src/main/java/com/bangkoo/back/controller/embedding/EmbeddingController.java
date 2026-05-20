package com.bangkoo.back.controller.embedding;

import com.bangkoo.back.dto.embedding.EmbeddingListRequestDTO;
import com.bangkoo.back.dto.embedding.EmbeddingProductRequestDTO;
import com.bangkoo.back.dto.embedding.EmbeddingRequestDTO;
import com.bangkoo.back.service.embedding.EmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 최초 작성자: 김병훈
 * 최초 작성일: 2025-04-17
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    /**
     * 임베딩을 생성하고 해당 정보를 ProductsRequestDTO로 생성 후, ProductController로 전달
     */
    @PostMapping("/embedding")
    public ResponseEntity<String> uploadEmbeddings(@RequestBody EmbeddingListRequestDTO requestDTO) {
        try {
            for (EmbeddingRequestDTO dto : requestDTO.getProducts()) {
                // 임베딩을 생성하고 DB에 저장
                embeddingService.saveProductWithEmbeddings(dto);
            }

            return ResponseEntity.ok("임베딩 및 저장 완료");
        } catch (Exception e) {
            // 예외 처리
            return ResponseEntity.status(500).body("임베딩 처리 중 오류 발생: " + e.getMessage());
        }
    }

}
