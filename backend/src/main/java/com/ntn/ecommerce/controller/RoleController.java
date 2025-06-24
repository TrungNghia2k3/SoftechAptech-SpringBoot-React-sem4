package com.ntn.ecommerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.request.RoleRequest;
import com.ntn.ecommerce.dto.request.UpdateRoleRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.RoleResponse;
import com.ntn.ecommerce.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAll() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }

    @PutMapping("/{role}")
    public ApiResponse<RoleResponse> update(@PathVariable String role, @RequestBody UpdateRoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.update(role, request))
                .build();
    }

    @DeleteMapping("/{role}")
    ApiResponse<Void> delete(@PathVariable String role) {
        roleService.delete(role);
        return ApiResponse.<Void>builder().message("Role deleted").build();
    }
}
