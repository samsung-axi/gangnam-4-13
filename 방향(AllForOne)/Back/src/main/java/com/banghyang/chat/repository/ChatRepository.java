package com.banghyang.chat.repository;

import com.banghyang.chat.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByMemberId(Long memberId);
}
