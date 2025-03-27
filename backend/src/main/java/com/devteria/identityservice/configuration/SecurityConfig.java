package com.devteria.identityservice.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINTS = {
            "/users",
            "/users/verify-account",
            "/users/regenerate-otp",
            "/users/forgot-password",
            "/users/reset-password",
            "/users/create-password",
            "/auth/token",
            "/auth/introspect",
            "/auth/logout",
            "/auth/refresh",
            "/auth/outbound/authentication",
            "/images/**",
            "/audio/**", // new
            "/products/**",
            "/categories/**",
            "/publishers/**",
            "/feedbacks/**",
            "/coupons/**",
            "/comments/**",
    };

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // Configure request authorization
        httpSecurity.authorizeHttpRequests(request -> request

                // Allow access to endpoints defined in PUBLIC_ENDPOINTS without authentication
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                // Require authentication for any other requests
                .anyRequest().authenticated());

        // Configure OAuth2 resource server settings
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2

                // Configure JWT decoder and authentication converter
                .jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder) // Use custom JWT decoder
                        .jwtAuthenticationConverter(jwtAuthenticationConverter())) // Use custom JWT authentication converter

                // Set the authentication entry point for handling unauthorized access
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        // Disable CSRF protection
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        // Build and return the SecurityFilterChain
        return httpSecurity.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Create a JwtGrantedAuthoritiesConverter to convert JWT claims to authorities
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // Set the authority prefix to an empty string
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        // Create a JwtAuthenticationConverter and set the JwtGrantedAuthoritiesConverter
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        // Return the configured JwtAuthenticationConverter
        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
