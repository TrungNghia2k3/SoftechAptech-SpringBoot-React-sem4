package com.ntn.ecommerce.dto.response;

import com.ntn.ecommerce.entity.Payment;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaymentResponse {
    private Payment payment;
    private VNPayResponse vnPayResponse;

    // Constructors, getters, and setters
    public PaymentResponse(Payment payment, VNPayResponse vnPayResponse) {
        this.payment = payment;
        this.vnPayResponse = vnPayResponse;
    }
}
