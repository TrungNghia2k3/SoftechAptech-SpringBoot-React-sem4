package com.ntn.ecommerce.dto.request;

import com.ntn.ecommerce.validator.StrongPasswordConstraint;

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
