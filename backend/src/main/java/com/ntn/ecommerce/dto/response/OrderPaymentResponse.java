package com.ntn.ecommerce.dto.response;

import com.ntn.ecommerce.entity.Order;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderPaymentResponse {
    // Getters and Setters
    private Order order;
    private PaymentResponse paymentResponse;

    // Constructors
    public OrderPaymentResponse(Order order, PaymentResponse paymentResponse) {
        this.order = order;
        this.paymentResponse = paymentResponse;
    }
}
