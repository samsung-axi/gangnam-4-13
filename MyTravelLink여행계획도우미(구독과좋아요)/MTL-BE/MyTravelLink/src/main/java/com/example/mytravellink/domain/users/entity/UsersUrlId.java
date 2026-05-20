package com.example.mytravellink.domain.users.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class UsersUrlId implements Serializable {
  private static final long serialVersionUID = 1L;

  @Column(name = "email")
  private String email;

  @Column(name = "url_id", columnDefinition = "VARCHAR(128)")
  private String urlId;
}
