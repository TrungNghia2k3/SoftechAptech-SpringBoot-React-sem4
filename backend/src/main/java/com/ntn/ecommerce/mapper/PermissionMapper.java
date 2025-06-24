package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.ntn.ecommerce.dto.request.PermissionRequest;
import com.ntn.ecommerce.dto.response.PermissionResponse;
import com.ntn.ecommerce.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
