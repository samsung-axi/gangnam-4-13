package com.bangkoo.back.controller.EB;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EBController {
    @GetMapping("/")
    public String home() {
        return "OK";
    }
}