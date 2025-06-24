package com.ntn.ecommerce.dto.response;

import java.time.LocalDateTime;

import com.ntn.ecommerce.entity.Cart;
import com.ntn.ecommerce.entity.Payment;
import com.ntn.ecommerce.entity.Transaction;
import com.ntn.ecommerce.entity.UserAddress;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    LocalDateTime orderDate;
    Long shippingFee;
    Long amount;
    Long totalAmount;
    Long discountAmount;
    String orderStatus;
    Long leadTime;
    LocalDateTime changedAt;
    Long totalSale;
    Cart cart;
    UserAddress userAddress;
    Payment payment;
    Transaction transactions;
}
