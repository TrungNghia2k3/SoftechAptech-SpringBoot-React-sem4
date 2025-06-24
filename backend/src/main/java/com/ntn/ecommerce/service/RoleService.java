package com.ntn.ecommerce.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.ntn.ecommerce.dto.request.RoleRequest;
import com.ntn.ecommerce.dto.request.UpdateRoleRequest;
import com.ntn.ecommerce.dto.response.RoleResponse;
import com.ntn.ecommerce.entity.Permission;
import com.ntn.ecommerce.entity.Role;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.mapper.RoleMapper;
import com.ntn.ecommerce.repository.PermissionRepository;
import com.ntn.ecommerce.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request) {

        // Check if a role with the same name already exists in the repository
        if (roleRepository.existsByName(request.getName()))

            // If the role already exists, throw an exception with an appropriate error code
            throw new AppException(ErrorCode.EXISTED_ROLE);

        // Convert the RoleRequest to a Role entity using a mapper
        var role = roleMapper.toRole(request);

        // Fetch the permissions associated with the role by their IDs
        var permissions = permissionRepository.findAllById(request.getPermissions());

        // Convert the role name to uppercase
        role.setName(role.getName().toUpperCase());

        // Set the permissions for the role and convert the list to a set
        role.setPermissions(new HashSet<>(permissions));

        // Save the role entity to the repository
        role = roleRepository.save(role);

        // Convert the saved Role entity to a RoleResponse DTO and return it
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    public RoleResponse update(String name, UpdateRoleRequest request) {
        // Fetch the existing Role entity
        Role existingRole = roleRepository.findById(name).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        // Update the fields of the existing role
        roleMapper.updateRoleFromRequest(request, existingRole);

        // Update the permissions
        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(request.getPermissions()));
        existingRole.setPermissions(permissions);

        // Save the updated entity back to the repository
        Role updatedRole = roleRepository.save(existingRole);

        // Return the updated entity as a response
        return roleMapper.toRoleResponse(updatedRole);
    }

    public void delete(String role) {
        roleRepository.deleteById(role);
    }
}
