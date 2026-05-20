package com.example.mytravellink.domain.users.repository.query;

import java.util.List;

import com.example.mytravellink.domain.users.entity.Users;

public interface UsersQueryRepository {
  public List<Users> findByDelete(Boolean delete);
}
