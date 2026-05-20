package com.bangkoo.back.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 최초 작성자 : 김태원
 * 최초 작성일 : 2025-04-11
 *
 * ☁️ Amazon S3 연결 설정 클래스
 * - .env 파일을 통해 AWS 인증 정보 및 리전을 주입받음
 * - AmazonS3 클라이언트를 Spring Bean으로 등록
 * - 외부 서비스(S3Uploader 등)에서 의존성 주입으로 사용 가능
 */
@Configuration
public class S3Config {

    /**
     * .env에서 AWS 설정을 로딩
     * - AWS_ACCESS_KEY
     * - AWS_SECRET_KEY
     * - AWS_REGION
     */
    private final Dotenv dotenv = Dotenv.configure()
            .directory(System.getProperty("user.dir"))
            .ignoreIfMissing()
            .load();

    private final String accessKey = dotenv.get("AWS_ACCESS_KEY");
    private final String secretKey = dotenv.get("AWS_SECRET_KEY");
    private final String region = dotenv.get("AWS_REGION");

    /**
     * Amazon S3 클라이언트 Bean 등록
     *
     * @return AmazonS3 인스턴스
     */
    @Bean
    public AmazonS3 amazonS3() {
        if (accessKey == null || secretKey == null || region == null) {
            throw new IllegalStateException("⚠️ AWS 설정(.env)이 누락되었습니다. 키 값을 확인해주세요.");
        }

        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }
}
