package com.ntn.ecommerce.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String firstName;
    String lastName;
    LocalDate dob;
    String phone;
    Boolean noPassword;
    Boolean active;
    String otp;
    Long points;
    LocalDateTime otpGeneratedTime;
    Set<RoleResponse> roles;
}
