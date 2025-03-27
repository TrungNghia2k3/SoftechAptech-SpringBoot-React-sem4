package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Cart;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
//    Cart cart; // Basic information about the cart
    Integer productQuantity; // Total quantity of products in the cart
    Long totalPriceProduct; // Total price of all products in the cart
    List<CartProductResponse> cartProducts; // Detailed information about products in the cart
}

