package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Payment;
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

