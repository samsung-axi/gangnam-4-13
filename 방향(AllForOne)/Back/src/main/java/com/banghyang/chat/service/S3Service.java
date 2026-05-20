package com.banghyang.chat.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // 기존 MultipartFile 업로드 메소드
    public String uploadImage(MultipartFile file) {
        String fileName = createFileName(file.getOriginalFilename()); // 파일 이름 생성
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(file.getSize());
        objectMetadata.setContentType(file.getContentType());

        try (InputStream inputStream = file.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

            return amazonS3.getUrl(bucket, fileName).toString();

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패했습니다.");
        }
    }

    // byte array 업로드용 새 메소드
    public String byteUploadImage(byte[] imageData, String originalFileName) {

        String fileName = createFileName(originalFileName);

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(imageData.length);
        objectMetadata.setContentType("image/jpeg");  // FastAPI 에서 생성된 이미지는 PNG 라고 가정

        try (InputStream inputStream = new ByteArrayInputStream(imageData)) {
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            return amazonS3.getUrl(bucket, fileName).toString();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패했습니다.");
        }
    }

    // 파일 삭제 메소드
    public void deleteImage(String fileName) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }

    // 파일 이름 생성 메소드
    private String createFileName(String fileName) {
        Long currentTime = System.currentTimeMillis();
        return currentTime + fileName;
    }

    // 파일 확장자 추출 메소드
    private String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 형식의 파일(" + fileName + ") 입니다.");
        }
    }
}