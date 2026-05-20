package com.banghyang.object.product.controller;

import com.banghyang.object.product.dto.PerfumeResponse;
import com.banghyang.object.product.dto.ProductCreateRequest;
import com.banghyang.object.product.dto.ProductDetailSimilarResponse;
import com.banghyang.object.product.dto.ProductModifyRequest;
import com.banghyang.object.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/products")
@RestController
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;

    /**
     * 일반향수 조회하기
     */
    @GetMapping
    public ResponseEntity<List<PerfumeResponse>> getAllPerfumes() {
        return ResponseEntity.ok(productService.getAllPerfumeResponses());
    }

    /**
     * 자체제작 향수 조회하기
     */
    @GetMapping("/product")
    public ResponseEntity<List<PerfumeResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductResponses());
    }

    /**
     * 향수 상세페이지에서 유사향수 조회하기
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailSimilarResponse> getProductDetailSimilar(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductDetailSimilar(productId));
    }

    /**
     * 새로운 제품 등록하기
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateRequest productCreateRequest) {
        productService.createProduct(productCreateRequest);
        return ResponseEntity.ok().build();
    }

    /**
     * 기존 제품 정보 수정하기
     */
    @PutMapping
    public ResponseEntity<?> modifyProduct(@RequestBody ProductModifyRequest productModifyRequest) {
        productService.modifyProduct(productModifyRequest);
        return ResponseEntity.ok().build();
    }

    /**
     * 기존 제품 삭제하기
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        productService.deletePerfume(productId);
        return ResponseEntity.ok().build();
    }

}
