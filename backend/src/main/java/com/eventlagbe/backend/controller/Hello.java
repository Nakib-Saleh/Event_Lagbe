package com.eventlagbe.backend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Hello {
    @RequestMapping("/")
    public String hello() {
        return "Hello World my name is Event Lagbe";
    }
}
