package com.example.mytravellink.domain.travel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class TravelInfoPlaceId implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Column(name = "travel_info_id")
    private String tid;
    
    @Column(name = "place_id")
    private String pid;
    
    @Builder
    public TravelInfoPlaceId(String travelInfoId, String placeId) {
        this.tid = travelInfoId;
        this.pid = placeId;
    }
}
