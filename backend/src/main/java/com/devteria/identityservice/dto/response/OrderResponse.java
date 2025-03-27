package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Cart;
import com.devteria.identityservice.entity.Payment;
import com.devteria.identityservice.entity.Transaction;
import com.devteria.identityservice.entity.UserAddress;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

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
