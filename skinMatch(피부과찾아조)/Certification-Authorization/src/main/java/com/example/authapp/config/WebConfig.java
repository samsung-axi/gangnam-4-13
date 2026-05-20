package com.example.authapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드 디렉토리의 절대 경로 얻기
        File uploadDirFile = new File(uploadDir);
        String absolutePath = uploadDirFile.getAbsolutePath();
        
        System.out.println("=== 정적 파일 서빙 설정 ===");
        System.out.println("Upload dir: " + uploadDir);
        System.out.println("Absolute path: " + absolutePath);
        System.out.println("File URL pattern: /uploads/**");
        System.out.println("Resource location: file:" + absolutePath + "/");
        
        // 업로드된 파일들을 정적 리소스로 서빙
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath + "/")
                .setCachePeriod(0)  // 캐싱 비활성화 (개발 중)
                .resourceChain(true);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 정적 파일에 대한 CORS 설정
        registry.addMapping("/uploads/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:8081"
                )
                .allowedMethods("GET", "HEAD", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)  // 정적 파일에는 credentials 불필요
                .maxAge(3600);
    }
}
