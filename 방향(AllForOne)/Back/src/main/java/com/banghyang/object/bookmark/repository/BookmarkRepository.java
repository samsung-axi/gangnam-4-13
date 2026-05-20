package com.banghyang.object.bookmark.repository;

import com.banghyang.object.bookmark.entity.Bookmark;
import com.banghyang.member.entity.Member;
import com.banghyang.object.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByMemberAndProduct(Member member, Product product);
    List<Bookmark> findByMember(Member member);
}
