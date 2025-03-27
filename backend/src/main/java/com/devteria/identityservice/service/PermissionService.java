package com.devteria.identityservice.service;

import java.util.List;

import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.devteria.identityservice.dto.request.PermissionRequest;
import com.devteria.identityservice.dto.response.PermissionResponse;
import com.devteria.identityservice.entity.Permission;
import com.devteria.identityservice.mapper.PermissionMapper;
import com.devteria.identityservice.repository.PermissionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {

        if (permissionRepository.existsByName(request.getName())) throw new AppException(ErrorCode.EXISTED_PERMISSION);

        Permission permission = permissionMapper.toPermission(request);
        permission.setName(permission.getName().toUpperCase());
        permission = permissionRepository.save(permission);

        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll() {
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permission) {
        permissionRepository.deleteById(permission);
    }
}
