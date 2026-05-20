package com.banghyang.object.product.repository;

import com.banghyang.object.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 카테고리 ID로 제품을 찾는 메서드
    List<Product> findByCategoryId(Long categoryId);

    // 제품 이름(한글)으로 제품을 찾는 메서드
    @Query("SELECT p FROM Product p WHERE p.nameKr = :nameKr")
    List<Product> findByNameKr(@Param("nameKr") String nameKr);

    default Optional<Product> findByNameKrSafe(String nameKr) {
        List<Product> products = findByNameKr(nameKr);
        if (products.isEmpty()) {
            return Optional.empty();  // 결과가 없으면 빈 Optional 반환
        }
        return Optional.of(products.get(0));  // 첫 번째 결과 반환
    }

    // ID와 카테고리로 상품 조회
    Optional<Product> findByIdAndCategoryId(Long id, Long categoryId);
}