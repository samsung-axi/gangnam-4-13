package com.banghyang.object.category.entity.repository;

import com.banghyang.object.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // findById를 커스텀 이름으로 사용할 경우
    Optional<Category> findCategoryById(Long id);
}