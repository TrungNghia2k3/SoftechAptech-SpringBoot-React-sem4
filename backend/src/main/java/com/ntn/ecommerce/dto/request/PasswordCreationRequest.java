package com.ntn.ecommerce.dto.request;

import jakarta.validation.constraints.NotEmpty;

import com.ntn.ecommerce.validator.StrongPasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordCreationRequest {

    @NotEmpty
    String oldPassword;

    @StrongPasswordConstraint
    String newPassword;
}
