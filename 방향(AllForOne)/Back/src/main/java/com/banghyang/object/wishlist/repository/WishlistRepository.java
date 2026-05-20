package com.banghyang.object.wishlist.repository;

import com.banghyang.member.entity.Member;
import com.banghyang.object.wishlist.entity.Wishlist;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface WishlistRepository extends CrudRepository<Wishlist, Long> {

    List<Wishlist> findByMemberIdAndProductId(Long memberId, Long productId);

    List<Wishlist> findByMember(Member member);
}
