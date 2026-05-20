package com.example.mytravellink.domain.users.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mytravellink.domain.users.entity.Users;
import com.example.mytravellink.domain.users.entity.UsersSearchTerm;

public interface UsersRepository extends JpaRepository<Users, String> {

  Optional<Users> findByEmail(String email);

  @Query("SELECT st FROM UsersSearchTerm st WHERE st.user.email = :email ORDER BY st.createAt ASC")
  List<UsersSearchTerm> findSearchTermsByEmailOrderByCreateAtAsc(@Param("email") String email);

}
