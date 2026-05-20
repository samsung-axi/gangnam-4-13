package com.bangkoo.back.utils;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 최초 작성자 : 김태원
 * 최초 작성일 : 2025-04-11
 *
 * ☁️ S3Uploader
 * - MultipartFile을 AWS S3에 업로드하고,
 * - 업로드된 이미지의 공개 URL을 반환하는 유틸 컴포넌트
 * - .env에서 버킷 이름을 가져오며, AWS 인증은 S3Config에서 관리
 */
@Component
@RequiredArgsConstructor
public class S3Uploader {

    private final AmazonS3 amazonS3;

    /**
     * .env에서 버킷 이름 로드
     */
    private final Dotenv dotenv = Dotenv.configure()
            .directory(System.getProperty("user.dir"))
            .ignoreIfMissing()
            .load();

    private final String bucket = dotenv.get("AWS_BUCKET");

    /**
     * S3 이미지 업로드
     *
     * @param file 업로드할 이미지 파일
     * @param dirName S3 디렉터리 경로 (예: "img")
     * @return 업로드된 이미지의 전체 URL
     * @throws IOException 파일 변환 오류
     */
    public String upload(MultipartFile file, String dirName) throws IOException {
        String fileName = dirName + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        amazonS3.putObject(bucket, fileName, file.getInputStream(), metadata);

        return amazonS3.getUrl(bucket, fileName).toString(); // 프론트에 넘길 이미지 URL
    }
}
