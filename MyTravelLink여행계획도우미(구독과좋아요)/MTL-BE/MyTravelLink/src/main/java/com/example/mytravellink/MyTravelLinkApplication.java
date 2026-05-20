package com.example.mytravellink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class MyTravelLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyTravelLinkApplication.class, args);
	}

}
