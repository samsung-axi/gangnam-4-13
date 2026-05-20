package com.bangkoo.back.service.product;

import com.bangkoo.back.dto.product.ProductsRequestDTO;
import com.bangkoo.back.dto.product.ProductsResponseDTO;
import com.bangkoo.back.model.product.Product;
import com.bangkoo.back.repository.product.ProductRepository;
import com.bangkoo.back.service.embedding.EmbeddingService;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
/**
 * ProductService 클래스는 제품(Product) 데이터를 저장, 수정, 삭제, 조회하는 서비스 로직을 담당합니다.
 */
public class ProductService {

    private final EmbeddingService embeddingService;            //임베딩 서비스 추가
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);  // Logger 객체 추가

    @Autowired
    private ProductRepository productRepository;

    /**
     * 새로운 제품을 저장합니다. 저장 시 생성일(createdAt)을 현재 시간으로 설정합니다.
     * @param product 저장할 제품 객체
     * @return 저장된 제품 객체
     */
    public Product save(Product product){
        if(product.getName() == null || product.getImageUrl() == null){
            logger.error("제품명과 이미지 URL은 필수입니다.");
            throw new IllegalArgumentException("제품명과 이미지 URL은 필수입니다.");
        }

        List<Double> imageEmbedding = embeddingService.generateImageEmbedding(product.getImageUrl());
        List<Double> textEmbedding = embeddingService.generateTextEmbedding(product.getDescription());
        List<Double> combined = combineEmbeddings(imageEmbedding, textEmbedding); // ✅ 추가

        product.setImageEmbedding(imageEmbedding);
        product.setTextEmbedding(textEmbedding);
        product.setCombinedEmbedding(combined); // ✅ 추가

        product.setCreatedAt(LocalDateTime.now());
        logger.info("새로운 제품 저장: {}", product.getName());

        return productRepository.save(product);
    }

    /**
     * CSV파일을 저장
     */
    public List<Product> saveProductsFromJson(List<ProductsRequestDTO> productsDtoList) {
        List<Product> savedProducts = new ArrayList<>();

        // 🔹 Step 1: 모든 이미지 URL 추출
        List<String> imageUrls = productsDtoList.stream()
                .map(ProductsRequestDTO::getImageUrl)
                .toList();

        // 🔹 Step 2: 이미지 임베딩 한 번에 요청
        List<List<Double>> imageEmbeddings = embeddingService.generateImageEmbeddings(imageUrls);

        for (int i = 0; i < productsDtoList.size(); i++) {
            ProductsRequestDTO dto = productsDtoList.get(i);
            try {
                Product product = Product.builder()
                        .name(dto.getName())
                        .description(dto.getDescription())
                        .detail(dto.getDetail())
                        .price(dto.getPrice())
                        .link(dto.getLink())
                        .imageUrl(dto.getImageUrl())
                        .model3dUrl(dto.getModel3dUrl())
                        .csv(dto.getCsv())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                // 🔹 이미지 임베딩
                List<Double> imageEmbedding = imageEmbeddings.get(i);
                if (imageEmbedding == null || imageEmbedding.isEmpty()) {
                    logger.warn("이미지 임베딩 실패 - 제품명: {}", dto.getName());
                    continue; // skip 저장
                }

                // 🔹 텍스트 임베딩 및 결합
                List<Double> textEmbedding = embeddingService.generateTextEmbedding(product.getDescription());
                List<Double> combined = combineEmbeddings(imageEmbedding, textEmbedding);

                product.setImageEmbedding(imageEmbedding);
                product.setTextEmbedding(textEmbedding);
                product.setCombinedEmbedding(combined);

                savedProducts.add(productRepository.save(product));
            } catch (Exception e) {
                logger.warn("임베딩 또는 저장 실패 - 제품명: {}, 오류: {}", dto.getName(), e.getMessage());
            }
        }

        return savedProducts;
    }



    /**
     * 기존 제품을 수정합니다. 해당 ID로 제품을 찾고, 값들을 업데이트한 후 저장합니다.
     * @param id 수정할 제품의 ID
     * @param updated 업데이트할 제품 정보
     * @return 수정된 제품 객체
     */
    public Product update(String id, Product updated) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product product = existing.get();
            product.setId(updated.getId());
            product.setName(updated.getName());
            product.setDescription(updated.getDescription());
            product.setModel3dUrl(updated.getModel3dUrl());
            product.setDetail(updated.getDetail());
            product.setPrice(updated.getPrice());
            product.setLink(updated.getLink());
            product.setImageUrl(updated.getImageUrl());


            logger.info("제품 수정: {}", product.getName());  // 로그 출력
            return productRepository.save(product);
        } else {
            logger.error("제품을 찾지 못 했습니다. ID: {}", id);  // 로그 출력
            throw new RuntimeException("제품을 찾지 못 했습니다.");
        }
    }

    /**
     * 제품 ID를 기반으로 제품을 삭제합니다.
     * @param id 삭제할 제품의 ID
     */
    public void delete(String id) {
        if(!productRepository.existsById(id)){
            logger.error("해당 제품은 존재하지 않습니다. ID: {}", id);  // 로그 출력
            throw new RuntimeException("해당 제품은 존재하지 않습니다.");
        }
        logger.info("제품 삭제: ID {}", id);  // 로그 출력
        productRepository.deleteById(id);
    }

    /**
     * 모든 제품 목록을 조회합니다.
     * @param page 조회할 페이지 번호
     * @param size 페이지당 출력할 제품 수
     * @return 페이징된 제품 리스트
     */
    public Page<Product> findAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> result = productRepository.findAll(pageable);
        return result;
    }


    /**
     * 제품 ID로 단일 제품을 조회합니다.
     * @param id 조회할 제품의 ID
     * @return 조회된 제품 객체
     */
    public Product findById(String id){
        return productRepository.findById(id)
                .orElseThrow(() -> {
                    return new RuntimeException("제품을 찾지 못 했습니다.");
                });
    }

    /**
     * 모든 제품을 가져와서
     * DTO로 변환해서 리스트로 만들기
     */
    public List<ProductsResponseDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> {
            ProductsResponseDTO dto = new ProductsResponseDTO();
            dto.setId(product.getId());
            dto.setDescription(product.getDescription());
            dto.setLink(product.getLink());
            dto.setImageUrl(product.getImageUrl());
            dto.setName(product.getName());
            dto.setCreatedAt(product.getCreatedAt());
            return dto;
        }).toList();
    }

    /**
     * 검색 관련

     * @param page 페이지 번호
     * @param size 페이지당 데이터 개수
     * @return 검색된 제품 리스트 (페이징 적용)
     */
    public Page<Product> searchByKeyword(String search, int page, int size) {
        // Pageable 생성
        PageRequest pageable = PageRequest.of(page, size);

        // ProductRepository의 searchByKeyword 호출
        return productRepository.searchByKeyword(search, pageable);

    }

    /**
     * CSV 업로드 및 저장 기능
     */

    public List<Product> saveProductFromCSV(MultipartFile file) throws Exception {
        List<Product> savedProducts = new ArrayList<>();

        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVReader csvReader = new CSVReaderBuilder(reader).withSkipLines(1).build(); // 헤더 스킵
            List<String[]> rows = csvReader.readAll();

            for (String[] row : rows) {
                if (row.length < 8) continue;

                Product product = Product.builder()
                        .name(row[0])
                        .description(row[1])
                        .detail(row[2])
                        .price(row[3])
                        .link(row[4])
                        .imageUrl(row[5])
                        .model3dUrl(row[6])
                        .csv(row[7])
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                try {
                    List<Double> imageEmbedding = embeddingService.generateImageEmbedding(product.getImageUrl());
                    List<Double> textEmbedding = embeddingService.generateTextEmbedding(product.getDescription());
                    List<Double> combined = combineEmbeddings(imageEmbedding, textEmbedding);

                    product.setImageEmbedding(imageEmbedding);
                    product.setTextEmbedding(textEmbedding);
                    product.setCombinedEmbedding(combined);
                } catch (Exception e) {
                    logger.warn("임베딩 실패 - 제품명: {}", product.getName());
                }

                savedProducts.add(productRepository.save(product));
            }

        } catch (Exception e) {
            logger.error("CSV 처리 중 오류 발생", e);
            throw new Exception("CSV 처리 중 오류 발생: " + e.getMessage());
        }

        return savedProducts;
    }

    // ✅ 이미지/텍스트 임베딩 결합 메서드
    public List<Double> combineEmbeddings(List<Double> image, List<Double> text) {
        List<Double> combined = new ArrayList<>();
        for (int i = 0; i < Math.min(image.size(), text.size()); i++) {
            combined.add((image.get(i) + text.get(i)) / 2.0);
        }
        return combined;
    }

    //다수의 상품 관련
    public List<Product> saveAll(List<Product> products) {
        return productRepository.saveAll(products);
    }
}