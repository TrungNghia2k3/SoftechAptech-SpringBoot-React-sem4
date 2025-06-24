package com.ntn.ecommerce.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {

    @NotEmpty
    String content;

    @NotNull
    @Min(value = 1, message = "Stars must be at least 1")
    @Max(value = 5, message = "Stars must not exceed 5")
    Integer stars;
}
