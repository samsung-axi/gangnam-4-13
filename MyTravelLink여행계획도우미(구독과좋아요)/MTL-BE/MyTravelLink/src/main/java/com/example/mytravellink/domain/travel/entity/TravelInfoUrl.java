package com.example.mytravellink.domain.travel.entity;

import com.example.mytravellink.domain.url.entity.Url;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class TravelInfoUrl {

  @EmbeddedId
  private TravelInfoUrlId id;

  @MapsId("tid")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "travel_info_id", columnDefinition = "VARCHAR(36)")
  private TravelInfo travelInfo;

  @MapsId("uid")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "url_id", columnDefinition = "VARCHAR(128)")
  private Url url;

  @Builder
  public TravelInfoUrl(TravelInfo travelInfo, Url url) {
    this.travelInfo = travelInfo;
    this.url = url;
    this.id = new TravelInfoUrlId(travelInfo.getId(), url.getId());
  }
}
