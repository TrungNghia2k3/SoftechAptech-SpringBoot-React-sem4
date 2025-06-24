package com.ntn.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    //    String id;
    //    String username;
    //    Boolean noPassword;
    //    Boolean active;
    //    Set<RoleResponse> roles;
    String token;
    boolean authenticated;
}
