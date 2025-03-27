package com.devteria.identityservice.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import com.devteria.identityservice.validator.ContactNumberConstraint;
import com.devteria.identityservice.validator.DobConstraint;
import com.devteria.identityservice.validator.StrongPasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @NotEmpty(message = "{name.not.empty}")
    String firstName;

    @NotEmpty(message = "{name.not.empty}")
    String lastName;

    @ContactNumberConstraint
    String phone;

    @DobConstraint(min = 12, message = "{age.adult.only}")
    LocalDate dob;
}
