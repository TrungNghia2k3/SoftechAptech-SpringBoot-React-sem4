package com.devteria.identityservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackRequest {
    @NotEmpty
    String name;

    @Email
    String email;

    @NotEmpty
    String subject;

    @NotEmpty
    String message;
}
