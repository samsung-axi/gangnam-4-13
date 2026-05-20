package com.bangkoo.back.utils;
import org.springframework.core.io.InputStreamResource;
import java.io.InputStream;
/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-03
 *
 * MultipartFile을 전송하기 위한 커스텀 InputStreamResource
 *
 * - 기본 InputStreamResource는 getFilename()을 제공하지 않아서 따로 만듦
 * - Spring의 RestTemplate에서 Multipart 전송 시 파일 이름을 명시해야 하므로 이를 확장
 */
public class MultipartInputStreamFileResource extends InputStreamResource {
    private final String filename;
    /**
     * @param inputStream 파일의 InputStream
     * @param filename    원본 파일 이름
     */
    public MultipartInputStreamFileResource(InputStream inputStream, String filename) {
        super(inputStream);
        this.filename = filename;
    }
    @Override
    public String getFilename() {
        return this.filename;
    }
    @Override
    public long contentLength() {
        return -1; // 파일 크기를 알 수 없으니까 -1 반환
    }
}