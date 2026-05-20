package com.example.authapp.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateProfileRequest {
    private String name;
    private String nickname;
    private String profileImage; // URL 형태
    private MultipartFile profileImageFile; // 파일 업로드 형태
    private String gender;
    private String birthYear;
    private String nationality;
}