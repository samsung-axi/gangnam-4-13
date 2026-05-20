package com.bangkoo.back.controller.product;

import com.bangkoo.back.dto.csv.CsvUploadResponseDTO;
import com.bangkoo.back.dto.product.ProductPageResponseDTO;
import com.bangkoo.back.dto.product.ProductsRequestDTO;
import com.bangkoo.back.dto.product.ProductsResponseDTO;
import com.bangkoo.back.mapper.ProductDtoMapper;
import com.bangkoo.back.model.product.Product;
import com.bangkoo.back.service.product.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")  // 기존 라우팅 유지
public class ProductController {

    private final ProductService productService;
    private final ProductDtoMapper dtoMapper;

    public ProductController(ProductService productService, ProductDtoMapper dtoMapper) {
        this.productService = productService;
        this.dtoMapper = dtoMapper;
    }

    /**
     * 제품 저장 API
     * POST /api/admin/product/save
     */
    @PostMapping("/product/save")
    public ProductsResponseDTO saveProduct(@RequestBody ProductsRequestDTO requestDTO) {
        Product product = dtoMapper.toEntity(requestDTO);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productService.save(product);
        return dtoMapper.toResponseDTO(saved);
    }

    /**
     * 다수의 제품을 등록시 저장API
     * POST /api/admin/product/saveAll
     */
    @PostMapping("/product/saveAll")
    public ResponseEntity<List<ProductsResponseDTO>> saveAll(@RequestBody List<ProductsRequestDTO> requestList) {
        List<Product> products = requestList.stream()
                .map(dtoMapper::toEntity)
                .peek(product -> {
                    product.setCreatedAt(LocalDateTime.now());
                    product.setUpdatedAt(LocalDateTime.now());
                })
                .collect(Collectors.toList());

        List<Product> savedProducts = productService.saveAll(products);

        List<ProductsResponseDTO> responseList = savedProducts.stream()
                .map(dtoMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    /**
     * 제품 수정 API
     * PUT /api/admin/product/{id}
     */
    @PutMapping("/product/{id}")
    public ProductsResponseDTO updateProduct(@PathVariable("id") String id,
                                             @RequestBody ProductsRequestDTO requestDTO) {
        Product product = dtoMapper.toEntity(requestDTO);
        Product updated = productService.update(id, product);
        return dtoMapper.toResponseDTO(updated);
    }

    /**
     * 제품 삭제 API
     * DELETE /api/admin/product/{id}
     */
    @DeleteMapping("/product/{id}")
    public void deleteProduct(@PathVariable("id") String id) {
        productService.delete(id);
    }

    /**
     * 전체 제품 조회 API (페이징)
     * GET /api/admin/product?page=0&size=10
     */
    @GetMapping("/product")
    public ProductPageResponseDTO getAllProducts(@RequestParam(name = "page") int page,
                                                 @RequestParam(name = "size") int size) {
        return getProducts(null, page, size);
    }

    /**
     * 제품 검색 + 목록 조회 API
     * GET /api/admin/products?searchTerm=xxx&page=0&size=10
     */
    @GetMapping("/products")
    public ProductPageResponseDTO searchProducts(@RequestParam(name = "searchTerm", required = false) String search,
                                                 @RequestParam(name = "page", defaultValue = "0") int page,
                                                 @RequestParam(name = "size", defaultValue = "10") int size) {
        return getProducts(search, page, size);
    }

    /**
     * 제품 목록 검색/조회 내부 처리 메서드
     */
    private ProductPageResponseDTO getProducts(String search, int page, int size) {
        Page<Product> productPage;

        if (search != null && !search.isBlank()) {
            productPage = productService.searchByKeyword(search, page, size);
        } else {
            productPage = productService.findAll(page, size);
        }

        List<ProductsResponseDTO> content = productPage.map(dtoMapper::toResponseDTO).getContent();

        // 디버깅용 로그 출력
        content.forEach(product -> System.out.println("[제품 이름] " + product.getName()));

        return new ProductPageResponseDTO(
                content,
                productPage.getTotalPages(),
                productPage.getTotalElements(),
                productPage.getNumber()
        );
    }

    /**
     * CSV 업로드 API
     * POST /api/admin/CSVupload
     */
    @PostMapping("/CSVupload")
    public ResponseEntity<CsvUploadResponseDTO> uploadCSV(@RequestBody List<ProductsRequestDTO> products) {
        try {
            List<Product> saved = productService.saveProductsFromJson(products);

            CsvUploadResponseDTO response = CsvUploadResponseDTO.builder()
                    .successCount(saved.size())
                    .failureCount(0)
                    .errors(List.of())
                    .build();

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            CsvUploadResponseDTO errorResponse = CsvUploadResponseDTO.builder()
                    .successCount(0)
                    .failureCount(products.size())
                    .errors(List.of("유효하지 않은 제품 데이터: " + e.getMessage()))
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            //예외 처리시, 로그를 추가
            System.out.println("CSV 업로드 처리중 오류 발생:"+ e.getMessage());

            CsvUploadResponseDTO errorResponse = CsvUploadResponseDTO.builder()
                    .successCount(0)
                    .failureCount(1)
                    .errors(List.of("서버 오류: " + e.getMessage()))
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
