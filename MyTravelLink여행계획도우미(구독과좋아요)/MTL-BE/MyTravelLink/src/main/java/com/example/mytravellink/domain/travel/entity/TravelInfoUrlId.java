package com.example.mytravellink.domain.travel.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Embeddable
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class TravelInfoUrlId implements Serializable {
  private static final long serialVersionUID = 1L;

  @Column(name = "travel_info_id", columnDefinition = "VARCHAR(36)")
  private String tid;

  @Column(name = "url_id", columnDefinition = "VARCHAR(128)")
  private String uid;

  @Builder
  public TravelInfoUrlId(String travelInfoId, String urlId) {
    this.tid = travelInfoId;
    this.uid = urlId;
  }
}
