package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Cart;
import com.devteria.identityservice.entity.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

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

