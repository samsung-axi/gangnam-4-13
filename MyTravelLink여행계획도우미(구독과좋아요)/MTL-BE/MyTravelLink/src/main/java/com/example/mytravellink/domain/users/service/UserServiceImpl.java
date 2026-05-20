package com.example.mytravellink.domain.users.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;

import com.example.mytravellink.domain.users.entity.Users;
import com.example.mytravellink.domain.users.entity.UsersSearchTerm;
import com.example.mytravellink.domain.users.repository.UsersRepository;
import com.example.mytravellink.domain.users.repository.UsersSearchTermRepository;
import com.example.mytravellink.domain.url.entity.Url;
import com.example.mytravellink.domain.url.repository.UrlRepository;
import com.example.mytravellink.domain.users.entity.UsersUrl;
import com.example.mytravellink.domain.users.repository.UsersUrlRepository;
import com.example.mytravellink.domain.users.entity.UsersUrlId;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Map;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UsersRepository usersRepository;
    private final UsersSearchTermRepository searchTermRepository;
    private final UrlRepository urlRepository;
    private final UsersUrlRepository usersUrlRepository;
    private static final int MAX_SEARCH_TERMS = 5;  // 최대 검색어 저장 개수

    @Transactional
    public void saveSearchTerm(String email, String searchTerm) {
        Users user = usersRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        // 현재 사용자의 검색어 개수 확인
        List<UsersSearchTerm> userSearchTerms = usersRepository.findSearchTermsByEmailOrderByCreateAtAsc(email);
        
        // 검색어가 5개 이상이면 가장 오래된 검색어부터 삭제
        if (userSearchTerms.size() >= MAX_SEARCH_TERMS) {
            int numberOfTermsToDelete = userSearchTerms.size() - MAX_SEARCH_TERMS + 1;
            for (int i = 0; i < numberOfTermsToDelete; i++) {
                searchTermRepository.delete(userSearchTerms.get(i));
            }
        }
        
        // 새로운 검색어 저장
        UsersSearchTerm searchTermEntity = UsersSearchTerm.builder()
            .user(user)
            .word(searchTerm)
            .build();
            
        searchTermRepository.save(searchTermEntity);
    }

    @Transactional(readOnly = true)
    public List<UsersSearchTerm> getRecentSearches(String email) {
        // Users user = usersRepository.findByEmail(email)
        //     .orElseThrow(() -> new RuntimeException("User not found"));
            
        return usersRepository.findSearchTermsByEmailOrderByCreateAtAsc(email);
    }

    @Transactional(readOnly = true)
    public List<UsersSearchTerm> getSearchTerms(String email) {
        Users user = usersRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            
        return searchTermRepository.findByUser(user);
    }

    @Transactional
    public void updateOrSaveSearchTerm(String email, String searchTerm) {
        Users user = usersRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 이미 존재하는 검색어인지 확인
        boolean exists = searchTermRepository.existsByUserEmailAndWord(email, searchTerm);

        if (exists) {
            // 이미 존재하는 경우 날짜만 업데이트
            searchTermRepository.updateSearchDate(email, searchTerm);
        } else {
            // 현재 사용자의 검색어 개수 확인
            List<UsersSearchTerm> userSearchTerms = usersRepository.findSearchTermsByEmailOrderByCreateAtAsc(email);
            
            // 검색어가 5개 이상이면 가장 오래된 검색어부터 삭제
            if (userSearchTerms.size() >= MAX_SEARCH_TERMS) {
                int numberOfTermsToDelete = userSearchTerms.size() - MAX_SEARCH_TERMS + 1;
                for (int i = 0; i < numberOfTermsToDelete; i++) {
                    searchTermRepository.delete(userSearchTerms.get(i));
                }
            }
            
            // 새로운 검색어 저장
            UsersSearchTerm searchTermEntity = UsersSearchTerm.builder()
                .user(user)
                .word(searchTerm)
                .build();
                
            searchTermRepository.save(searchTermEntity);
        }
    }


    @Transactional
    public Optional<Users> getUserByEmail(String email){
        return usersRepository.findByEmail(email);
    }

}
