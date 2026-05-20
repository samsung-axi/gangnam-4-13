package com.banghyang.object.cart.repository;

import com.banghyang.member.entity.Member;
import com.banghyang.object.cart.entity.Cart;
import com.banghyang.object.product.entity.Product;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends CrudRepository<Cart, Long> {

    Optional<Cart> findByMemberIdAndProductId(Long memberId, Long productId);

    List<Cart> findByMember(Member member);

    Optional<Cart> findByMemberAndProduct(Member targetMemberEntity, Product product);
}
