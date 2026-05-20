package com.bangkoo.back.repository.product;


import com.bangkoo.back.model.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    /**
     * name, description, id로 검색
     *
     * @param search
     * @param pageable
     * @return
     */
    @Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}, {'id': {$regex: ?0, $options: 'i'}}]}")
    Page<Product> searchByKeyword(String search, Pageable pageable);

    // 전체 제품 조회 (페이징 처리 포함)
    Page<Product> findAll(Pageable pageable);

    /**
     * 스타일과 카테고리를 기준으로 가구를 추천하기 위한 쿼리
     * (AutoRecommend에서 사용 가능)
     *
     * @param category 가구 카테고리
     * @return 추천된 제품 목록
     */
    List<Product> findByCategory(String category);

}
