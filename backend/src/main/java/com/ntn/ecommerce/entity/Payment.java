package com.ntn.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    Long amount;

    @Column(length = 50)
    String paymentStatus;

    LocalDateTime paymentDate;

    @Column(length = 50)
    String paymentMethod; // VNPay or Cash on Delivery

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    Order order; // Each payment is associated with one order
}
