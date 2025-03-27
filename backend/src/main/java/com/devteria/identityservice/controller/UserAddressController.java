package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.UserAddressRequest;
import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.UserAddressResponse;
import com.devteria.identityservice.service.UserAddressService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    ApiResponse<UserAddressResponse> createAddress(@PathVariable String userId,
                                                   @RequestBody @Valid UserAddressRequest request) {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.create(userId, request))
                .build();
    }

    @PutMapping("/{id}/{userId}")
    ApiResponse<UserAddressResponse> editAddress(@PathVariable String userId,
                                                   @PathVariable Long id,
                                                   @RequestBody @Valid UserAddressRequest request) {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.edit(userId, id, request))
                .build();
    }
}
