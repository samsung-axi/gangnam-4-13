package com.example.mytravellink.domain.url.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class UrlPlaceId implements Serializable {
  
  @Column(name = "url_id", columnDefinition = "VARCHAR(128)")
  private String uid;

  @Column(name = "place_id", columnDefinition = "CHAR(36)")
  private String pid;
}
