package com.ntn.ecommerce.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotEmpty;

import com.ntn.ecommerce.validator.ContactNumberConstraint;
import com.ntn.ecommerce.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    @NotEmpty(message = "firstname.not.empty")
    String firstName;

    @NotEmpty(message = "name.not.empty")
    String lastName;

    @ContactNumberConstraint
    String phone;

    @DobConstraint(min = 12, message = "age.adult.only")
    LocalDate dob;
}
