package com.example.mytravellink.domain.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mytravellink.domain.users.entity.UsersSearchTerm;
import com.example.mytravellink.domain.users.entity.Users;

import java.util.List;

@Repository
public interface UsersSearchTermRepository extends JpaRepository<UsersSearchTerm, String> {
    // JpaRepository를 상속받으면 기본적인 CRUD 메서드들이 자동으로 생성됩니다.
    // save(), delete(), findById() 등을 별도로 구현할 필요 없습니다.
    
    List<UsersSearchTerm> findByUser(Users user);

    @Modifying
    @Query(value = "UPDATE user_search_term SET create_at = CURRENT_TIMESTAMP " +
           "WHERE email = :email AND word = :searchTerm", nativeQuery = true)
    void updateSearchDate(@Param("email") String email, @Param("searchTerm") String searchTerm);

    boolean existsByUserEmailAndWord(String email, String word);
} 