package com.ntn.ecommerce.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    List<CartProductRequest> selectedProducts; // LIST product id and quantity

    @NotEmpty
    Long amount;

    @NotEmpty
    Long discountAmount;

    @NotEmpty
    Long shippingFee;

    @NotEmpty
    String userId;

    @NotEmpty
    Long leadTime;

    @NotEmpty
    Long userAddressId;

    @NotEmpty
    String paymentMethod; // "COD" or "VNPAY"
}
