package com.bangkoo.back.repository.auth;


import com.bangkoo.back.model.auth.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {

    /**
     * 유저 레포지토리 생성
     * @param email
     * @return
     */
    Optional<User> findByEmail(String email);
}
