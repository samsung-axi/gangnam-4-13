package com.example.mytravellink.domain.url.repository;

import com.example.mytravellink.domain.url.entity.Url;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UrlRepository extends JpaRepository<Url, String> {
  Optional<Url> findById(String id);

  Optional<Url> findByUrl(String url);

  // Url ID 목록을 이용해 Url 엔티티 리스트 조회
  List<Url> findByIdIn(List<String> urlIds);

}
