package com.skillchef.skillchef_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF for development only
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ Allow preflight CORS requests
                .requestMatchers("/api/users/**").permitAll()            // ✅ All user endpoints
                .requestMatchers("/api/posts/**").permitAll()            // ✅ All post endpoints
                .requestMatchers("/uploads/**").permitAll()              // ✅ Allow image file access
                .anyRequest().permitAll()                                // ✅ Allow all (dev only)
            );

        return http.build();
    }
}
