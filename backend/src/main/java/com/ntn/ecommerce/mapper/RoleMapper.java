package com.ntn.ecommerce.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import com.ntn.ecommerce.dto.request.RoleRequest;
import com.ntn.ecommerce.dto.request.UpdateRoleRequest;
import com.ntn.ecommerce.dto.response.RoleResponse;
import com.ntn.ecommerce.entity.Permission;
import com.ntn.ecommerce.entity.Role;

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
        return permissionNames.stream().map(name -> new Permission(name, null)).collect(Collectors.toSet());
    }

    @Named("mapToStringSet")
    default Set<String> mapToStringSet(Set<Permission> permissions) {
        if (permissions == null) {
            return null;
        }
        return permissions.stream().map(Permission::getName).collect(Collectors.toSet());
    }
}
