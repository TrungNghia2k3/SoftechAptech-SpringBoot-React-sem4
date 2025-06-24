package com.ntn.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartProductResponse {
    Long id; // ID of the CartProduct
    Integer quantity; // Quantity of the product in the cart
    Long totalPrice; // Total price for this product in the cart
    ProductResponse product; // Product details including image URLs
}
