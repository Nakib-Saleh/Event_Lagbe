package com.eventlagbe.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors() // enable CORS
            .and()
            .csrf().disable() // disable CSRF for development
            .authorizeHttpRequests((authz) -> authz
                .anyRequest().permitAll() // Allow all requests for now
            );

        return http.build();
    }
}
