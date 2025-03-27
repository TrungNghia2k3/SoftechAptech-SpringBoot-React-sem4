package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.UpdateRoleRequest;
import com.devteria.identityservice.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.devteria.identityservice.dto.request.RoleRequest;
import com.devteria.identityservice.dto.response.RoleResponse;
import com.devteria.identityservice.entity.Role;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);

    @Mapping(target = "name", ignore = true) // Assuming you don't want to update the name
    @Mapping(target = "permissions", source = "permissions", qualifiedByName = "mapToPermissionSet")
    void updateRoleFromRequest(UpdateRoleRequest request, @MappingTarget Role role);

    @Named("mapToPermissionSet")
    default Set<Permission> mapToPermissionSet(Set<String> permissionNames) {
        if (permissionNames == null) {
            return null;
        }
        return permissionNames.stream()
                .map(name -> new Permission(name, null))
                .collect(Collectors.toSet());
    }

    @Named("mapToStringSet")
    default Set<String> mapToStringSet(Set<Permission> permissions) {
        if (permissions == null) {
            return null;
        }
        return permissions.stream()
                .map(Permission::getName)
                .collect(Collectors.toSet());
    }
}
