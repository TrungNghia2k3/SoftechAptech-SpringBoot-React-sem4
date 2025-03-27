package com.devteria.identityservice.dto.request;

import com.devteria.identityservice.entity.Permission;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateRoleRequest {
    String description;
    Set<String> permissions; // Assuming permissions are identified by their names
}
