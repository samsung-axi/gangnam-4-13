package com.example.authapp.service;

import com.example.authapp.dto.oauth.OAuthUserInfo;
import com.example.authapp.dto.request.UpdateProfileRequest;
import com.example.authapp.entity.Provider;
import com.example.authapp.entity.User;
import com.example.authapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final EntityManager entityManager;
    private final FileUploadService fileUploadService;

    // 사용자 ID로 조회
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // 이메일로 사용자 조회
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 아이디로 사용자 조회
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 제공자와 제공자 ID로 사용자 조회
    public Optional<User> findByProviderAndProviderId(Provider provider, String providerId) {
        return userRepository.findByProviderAndProviderId(provider, providerId);
    }

    // OAuth 사용자 생성 또는 업데이트
    @Transactional
    public User createOrUpdateOAuthUser(OAuthUserInfo oAuthUserInfo) {
        Provider provider = oAuthUserInfo.getProvider();
        String providerId = oAuthUserInfo.getProviderId();
        String email = oAuthUserInfo.getEmail();

        // 1. 제공자 ID로 기존 사용자 조회
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);

        if (existingUser.isPresent()) {
            // 기존 사용자 정보 업데이트
            User user = existingUser.get();
            
            // 외부 이미지를 로컬로 다운로드
            String profileImageUrl = downloadExternalProfileImage(oAuthUserInfo.getProfileImage());
            
            user.updateBasicProfile(oAuthUserInfo.getName(), profileImageUrl);
            log.info("Updated existing user: {} from provider: {}", email, provider);
            return userRepository.save(user);
        }

        // 2. Kakao의 경우 가상 이메일 중복 확인 스킵
        if (!email.endsWith("@kakao.local")) {
            Optional<User> userWithSameEmail = userRepository.findByEmail(email);
            if (userWithSameEmail.isPresent()) {
                log.warn("User with same email exists with different provider. Email: {}, Existing provider: {}, New provider: {}",
                        email, userWithSameEmail.get().getProvider(), provider);
                // 여기서는 새로운 사용자로 생성하지만, 비즈니스 로직에 따라 변경 가능
            }
        }

        // 3. 새 사용자 생성
        User newUser = createUserByProvider(provider, oAuthUserInfo);
        User savedUser = userRepository.save(newUser);
        log.info("Created new user: {} from provider: {}", email, provider);

        return savedUser;
    }

    // 외부 프로필 이미지를 로컬로 다운로드
    private String downloadExternalProfileImage(String externalImageUrl) {
        if (externalImageUrl == null || externalImageUrl.trim().isEmpty()) {
            return null;
        }

        // 이미 로컬 URL인 경우 그대로 반환
        if (externalImageUrl.startsWith("http://localhost:808")) {
            return externalImageUrl;
        }

        // 외부 이미지인 경우 다운로드 시도
        log.info("외부 프로필 이미지 다운로드 시도: {}", externalImageUrl);
        String localImageUrl = fileUploadService.downloadAndSaveImage(externalImageUrl);
        
        if (localImageUrl != null) {
            log.info("외부 이미지 다운로드 성공: {} -> {}", externalImageUrl, localImageUrl);
            return localImageUrl;
        } else {
            log.warn("외부 이미지 다운로드 실패, 원본 URL 사용: {}", externalImageUrl);
            return externalImageUrl; // 다운로드 실패 시 원본 URL 유지
        }
    }

    // 제공자별 사용자 생성
    private User createUserByProvider(Provider provider, OAuthUserInfo oAuthUserInfo) {
        // 외부 이미지를 로컬로 다운로드
        String profileImageUrl = downloadExternalProfileImage(oAuthUserInfo.getProfileImage());
        
        return switch (provider) {
            case GOOGLE -> User.createGoogleUser(
                    oAuthUserInfo.getEmail(),
                    oAuthUserInfo.getName(),
                    profileImageUrl, // 다운로드된 로컬 URL 사용
                    oAuthUserInfo.getProviderId()
            );
            case NAVER -> User.createNaverUser(
                    oAuthUserInfo.getEmail(),
                    oAuthUserInfo.getName(),
                    profileImageUrl, // 다운로드된 로컬 URL 사용
                    oAuthUserInfo.getProviderId()
            );
        };
    }

    // 사용자 정보 업데이트 (기존 - 기본 정보만)
    @Transactional
    public User updateUser(Long userId, String name, String profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));

        user.updateBasicProfile(name, profileImage);
        return userRepository.save(user);
    }

    // 사용자 전체 프로필 업데이트 (새로운)
    @Transactional
    public User updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));

        log.info("=== 프로필 업데이트 시작 ===");
        log.info("사용자 ID: {}", userId);
        log.info("기존 닉네임: {}", user.getNickname());
        log.info("요청 닉네임: {}", request.getNickname());
        log.info("사용자 username: {}", user.getUsername());
        log.info("사용자 provider: {}", user.getProvider());

        // 닉네임이 비어있으면 username을 사용
        String finalNickname = (request.getNickname() != null && !request.getNickname().trim().isEmpty()) 
                ? request.getNickname().trim() 
                : user.getUsername();

        log.info("최종 닉네임: {}", finalNickname);

        user.updateProfile(
                request.getName(),
                finalNickname, // 처리된 닉네임 사용
                request.getProfileImage(),
                request.getGender(),
                request.getBirthYear(),
                request.getNationality()
        );
        
        User savedUser = userRepository.save(user);
        entityManager.flush(); // 명시적으로 flush
        
        // 데이터베이스에서 직접 다시 조회
        User reloadedUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 재조회 실패"));
        
        log.info("저장 후 닉네임: {}", savedUser.getNickname());
        log.info("재조회 후 닉네임: {}", reloadedUser.getNickname());
        log.info("=== 프로필 업데이트 완료 ===");
        
        return reloadedUser; // 재조회된 사용자 반환
    }

    // 사용자 존재 여부 확인
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // 아이디 존재 여부 확인
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByProviderAndProviderId(Provider provider, String providerId) {
        return userRepository.existsByProviderAndProviderId(provider, providerId);
    }

    // 사용자 저장
    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    // 모든 사용자 조회 (개발용)
    public List<User> findAll() {
        return userRepository.findAll();
    }
}