package com.example.mytravellink.auth.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.mytravellink.domain.users.entity.Users;
import com.example.mytravellink.domain.users.repository.UsersRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepository memberRepository; // 사용자 정보를 가져오는 레포지토리

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

       Users member = memberRepository.findByEmail(email)
               .orElseThrow(()-> new UsernameNotFoundException("가입 되지 않은 회원입니다."));

       return new CustomUserDetails(member);
    }
}
