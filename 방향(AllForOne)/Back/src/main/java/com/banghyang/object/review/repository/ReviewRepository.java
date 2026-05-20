package com.banghyang.object.review.repository;

import com.banghyang.member.entity.Member;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.review.entity.Review;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReviewRepository extends CrudRepository<Review, Long> {
    List<Review> findByProduct(Product product);

    List<Review> findByMemberId(Long memberId);

    List<Review> findByProductId(Long productId);
}
