package com.ntn.ecommerce.dto.request;

import jakarta.validation.constraints.Min;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartProductRequest {
    String productId;

    @Min(1)
    Integer quantity;
}
