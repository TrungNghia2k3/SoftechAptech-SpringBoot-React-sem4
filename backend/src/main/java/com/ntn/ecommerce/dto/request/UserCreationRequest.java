package com.ntn.ecommerce.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

import com.ntn.ecommerce.validator.ContactNumberConstraint;
import com.ntn.ecommerce.validator.DobConstraint;
import com.ntn.ecommerce.validator.StrongPasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @Email(message = "email.not.valid")
    String username;

    @StrongPasswordConstraint
    String password;

    @NotEmpty(message = "firstname.not.empty")
    String firstName;

    @NotEmpty(message = "lastname.not.empty")
    String lastName;

    @ContactNumberConstraint
    String phone;

    @DobConstraint(min = 12, message = "age.adult.only")
    LocalDate dob;
}
