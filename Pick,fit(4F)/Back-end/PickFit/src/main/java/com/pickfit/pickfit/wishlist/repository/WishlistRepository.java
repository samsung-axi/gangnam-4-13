package com.pickfit.pickfit.wishlist.repository;

import com.pickfit.pickfit.wishlist.entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, Integer> {
    List<WishlistEntity> findByUserEmail(String userEmail);
    Optional<WishlistEntity> findByProductIdAndUserEmail(Long productId, String userEmail);
}
