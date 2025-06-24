package com.ntn.ecommerce.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherRequest {

    @Size(min = 2, max = 2, message = "Code must be equal to 2 characters")
    String code;

    @NotEmpty
    String name;
}
