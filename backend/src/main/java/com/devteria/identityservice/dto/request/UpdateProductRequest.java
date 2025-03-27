package com.devteria.identityservice.dto.request;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateProductRequest {

    @NotEmpty
    String title;

    @NotEmpty
    String author;

    @NotNull
    Long price;

    @NotNull
    Long categoryId;

    @NotNull
    Long publisherId;

}

