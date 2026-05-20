package com.bangkoo.back.model.auth;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * 몽고DB에 저장될 유저 정보 형식
     */
    @Id
    private String id;

    private String email;
    private String nickname;
    private String role;
}
