package com.ntn.ecommerce.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.request.UserAddressRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.UserAddressResponse;
import com.ntn.ecommerce.service.UserAddressService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/useraddresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserAddressController {
    UserAddressService userAddressService;

    @GetMapping("/{userId}")
    ApiResponse<List<UserAddressResponse>> getAddressList(@PathVariable String userId) {
        return ApiResponse.<List<UserAddressResponse>>builder()
                .result(userAddressService.getAddressListByUserId(userId))
                .build();
    }

    @PostMapping("/{userId}")
    ApiResponse<UserAddressResponse> createAddress(
            @PathVariable String userId, @RequestBody @Valid UserAddressRequest request) {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.create(userId, request))
                .build();
    }

    @PutMapping("/{id}/{userId}")
    ApiResponse<UserAddressResponse> editAddress(
            @PathVariable String userId, @PathVariable Long id, @RequestBody @Valid UserAddressRequest request) {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.edit(userId, id, request))
                .build();
    }
}
