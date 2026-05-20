package com.bangkoo.back;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("dev")
@TestPropertySource("classpath:application-db.yml")
class BackApplicationTests {

    @Test
    void contextLoads() {
    }

}
