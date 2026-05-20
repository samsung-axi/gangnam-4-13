package com.banghyang.object.product.repository;

import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProduct(Product product);
}
