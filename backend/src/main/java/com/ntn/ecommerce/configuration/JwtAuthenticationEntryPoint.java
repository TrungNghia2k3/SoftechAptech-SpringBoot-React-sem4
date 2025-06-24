package com.ntn.ecommerce.configuration;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.exception.ErrorCode;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        // Define the error code to be used in the response
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;

        // Set the HTTP status code for the response based on the error code
        response.setStatus(errorCode.getStatusCode().value());

        // Set the content type of the response to JSON
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // Create an ApiResponse object with the error code and message
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        // Create an ObjectMapper to convert the ApiResponse object to JSON
        ObjectMapper objectMapper = new ObjectMapper();

        // Write the JSON representation of ApiResponse to the response writer
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));

        // Flush the response buffer to ensure all data is sent to the client
        response.flushBuffer();
    }
}
