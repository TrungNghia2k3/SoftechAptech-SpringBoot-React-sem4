package com.devteria.identityservice.dto.request;

import com.devteria.identityservice.validator.StrongPasswordConstraint;
import jakarta.validation.constraints.NotEmpty;
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
