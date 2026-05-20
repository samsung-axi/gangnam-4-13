//package com.example.mytravellink;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebMvcConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/api/**") // 경로
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedOrigins("http://localhost:3000", "http://localhost:9000",
//                        "http://13.125.216.39:3000", "http://13.125.216.39:7000",
//                        "http://13.125.216.39:8000", "http://13.125.216.39:9000",
//                        "https://challengedonkey.com")
//                .allowedHeaders("*") // 모든 요청해더
//                .exposedHeaders("Authorization", "Cross-Origin-Opener-Policy", "Set-Cookie")  //노출시킬헤더, // COOP 헤더 추가, //Set-Cookie 헤더 추가
//                .allowCredentials(true); // 쿠키허용
//    }
//
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        String saveDir;
//        String osName = System.getProperty("os.name").toLowerCase();
//        /*
//         * 각자 저장할 로컬 위치 넣어서 테스트 해야합니다. aws 연결후에 강사님 께서 알려주신 방법으로 클라우드 서버 이용해서 업로드 테스트 해보겠습니다.
//         */
//        if (osName.contains("windows")) {
//            saveDir = "/app/upload/";
//            //saveDir = "/Users/jiminpark/Desktop/upload/";
//            registry.addResourceHandler("/upload/**")
//                    //.addResourceLocations("file:C:\\javaStudy\\upload\\");
//                    .addResourceLocations("file:" + saveDir);
//
//
//        }else {
//            saveDir = "/app/upload/";
//            //saveDir = "/Users/jiminpark/Desktop/upload/";
////			saveDir = "/home/ec2-user/upload/";
//            registry.addResourceHandler("/upload/**")
//                    .addResourceLocations("file:" + saveDir);
//
//        }
//
//
//    }
//
//
//}