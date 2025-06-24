package com.ntn.ecommerce.dto.request;

import java.util.Set;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateRoleRequest {
    String description;
    Set<String> permissions; // Assuming permissions are identified by their names
}
