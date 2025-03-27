package com.devteria.identityservice.dto.request;

import com.devteria.identityservice.validator.StrongPasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SetPasswordRequest {
    @StrongPasswordConstraint
    String newPassword;
}
