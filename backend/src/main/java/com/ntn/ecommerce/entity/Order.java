package com.ntn.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Order {
    @Id
    String id;

    LocalDateTime orderDate;

    Long shippingFee;

    Long amount;

    Long discountAmount;

    Long totalAmount;

    @Column(length = 100)
    String orderStatus;

    Long leadTime;

    LocalDateTime changedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    User user;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference
    Cart cart;

    @ManyToOne
    @JoinColumn(name = "user_address_id", nullable = false)
    @JsonBackReference
    UserAddress userAddress;

    @OneToOne(mappedBy = "order")
    @JsonManagedReference
    Payment payment; // Each order is associated with one payment

    @OneToOne(mappedBy = "order")
    @JsonManagedReference
    Transaction transactions;
}
