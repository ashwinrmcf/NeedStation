package com.example.authbackend.config;

import com.example.authbackend.security.JwtAuthenticationFilter;
import com.example.authbackend.security.OtpSecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private OtpSecurityFilter otpSecurityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors
                .configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowCredentials(false);
                    config.addAllowedOrigin("*");
                    config.addAllowedMethod("*");
                    config.addAllowedHeader("*");
                    return config;
                })
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/contact").permitAll()
                .requestMatchers("/api/contact/**").permitAll()
                .requestMatchers("/api/chatbot/query").permitAll()
                .requestMatchers("/api/translate").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/error").permitAll()
                
                // OTP endpoints - special handling
                .requestMatchers("/api/otp/**").permitAll()
                .requestMatchers("/api/worker/otp/**").permitAll()
                
                // User profile endpoints - allow access (for testing, you can add authentication later)
                .requestMatchers("/api/user/profile/**").permitAll()
                .requestMatchers("/api/user/update-form-data").permitAll()
                
                // Worker registration endpoints - public access
                .requestMatchers("/api/worker/register/**").permitAll()
                .requestMatchers("/api/workers/register/**").permitAll()
                .requestMatchers("/api/worker/check-phone/**").permitAll()
                .requestMatchers("/api/worker/findByPhone/**").permitAll()
                .requestMatchers("/api/worker/verify-name").permitAll()
                .requestMatchers("/api/worker/delete/**").permitAll()
                .requestMatchers("/api/worker/test-upload").permitAll()
                .requestMatchers("/api/workers/resend-otp").permitAll()
                .requestMatchers("/api/workers/verify-otp").permitAll()
                .requestMatchers("/api/worker/login").permitAll()
                .requestMatchers("/api/worker/details/**").permitAll()
                
                // Worker authenticated endpoints - require WORKER role
                .requestMatchers("/api/worker/profile").hasRole("WORKER")
                .requestMatchers("/api/worker/registration/**").hasRole("WORKER")
                
                // Admin endpoints - require ADMIN role
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(otpSecurityFilter, JwtAuthenticationFilter.class);
            
        return http.build();
    }
}