package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.*;
import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.dto.response.UserResponse;
import com.devteria.identityservice.dto.response.VerifyAccountResponse;
import com.devteria.identityservice.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder().result(userService.createUser(request)).build();
    }

    @PostMapping("/verify-account")
    ApiResponse<VerifyAccountResponse> verifyAccount(@RequestBody VerifyAccountRequest request) {
        return ApiResponse.<VerifyAccountResponse>builder().result(userService.verifyAccount(request)).build();
    }

    @PostMapping("/regenerate-otp")
    ApiResponse<Void> regenerateOtp(@RequestBody RegenerateOtpRequest request) {
        userService.regenerateOtp(request);
        return ApiResponse.<Void>builder().message("OTP regenerated").build();
    }

    @PostMapping("/forgot-password")
    ApiResponse<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request);
        return ApiResponse.<Void>builder().message("Please check your email").build();
    }

    @PostMapping("/reset-password")
    ApiResponse<Void> setPassword(@RequestParam String username, @RequestBody @Valid SetPasswordRequest request) {
        userService.setPassword(username, request);
        return ApiResponse.<Void>builder().message("Password has been created").build();
    }

    @PostMapping("/change-password")
    ApiResponse<Void> changePassword(@RequestBody @Valid PasswordCreationRequest request) {
        userService.changePassword(request);
        return ApiResponse.<Void>builder().message("Password has been changed").build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder().result(userService.getUsers()).build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder().result(userService.getUser(userId)).build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder().result(userService.getMyInfo()).build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder().result(userService.updateUser(userId, request)).build();
    }

    @GetMapping("/pagination-sort")
    public ApiResponse<PageResponse<UserResponse>> getAllPaginationSortUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        PageResponse<UserResponse> users = userService.getAllPaginationSortUsers(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<UserResponse>>builder().result(users).build();
    }
}
