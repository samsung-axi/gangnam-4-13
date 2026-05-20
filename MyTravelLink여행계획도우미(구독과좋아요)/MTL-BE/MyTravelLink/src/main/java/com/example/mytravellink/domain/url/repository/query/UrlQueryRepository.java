package com.example.mytravellink.domain.url.repository.query;

import com.example.mytravellink.domain.url.entity.Url;

import java.util.List;

public interface UrlQueryRepository {
  public List<Url> findAllByEmailId(String emailId);
}
