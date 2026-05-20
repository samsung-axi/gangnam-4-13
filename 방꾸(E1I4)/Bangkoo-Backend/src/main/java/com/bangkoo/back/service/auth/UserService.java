package com.bangkoo.back.service.auth;

import com.bangkoo.back.model.auth.User;
import com.bangkoo.back.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    /**
     * 유저 저장과 조회 관련 서비스
     *
     */
    private final UserRepository userRepository;

    public User findOrCreate(String email, String nickname,
                             String role) {
        Optional<User> userOptional  = userRepository.findByEmail(email);

        return userOptional .orElseGet(() ->{
            User newUser = User.builder()
                    .email(email)
                    .nickname(nickname)
                    .role(role)
                    .build();
            return userRepository.save(newUser);
        });
    }
}
