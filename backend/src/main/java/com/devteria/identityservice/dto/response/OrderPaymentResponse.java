package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Order;
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

