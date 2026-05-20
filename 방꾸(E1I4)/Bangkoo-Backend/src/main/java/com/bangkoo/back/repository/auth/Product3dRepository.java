package com.bangkoo.back.repository.auth;

import com.bangkoo.back.model.product.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface Product3dRepository extends MongoRepository<Product, String> {
}
