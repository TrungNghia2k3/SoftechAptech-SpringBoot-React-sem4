package com.ntn.ecommerce.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class UserCoupons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "coupon_id", nullable = false)
    Coupon coupon;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    Integer quantity;
}
