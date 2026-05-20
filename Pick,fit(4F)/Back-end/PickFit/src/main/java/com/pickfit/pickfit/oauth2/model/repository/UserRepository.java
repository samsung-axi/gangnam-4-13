package com.pickfit.pickfit.oauth2.model.repository;

import com.pickfit.pickfit.oauth2.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
}