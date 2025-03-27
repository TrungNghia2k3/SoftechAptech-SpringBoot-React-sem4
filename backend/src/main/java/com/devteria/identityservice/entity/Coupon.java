package com.devteria.identityservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Coupon {

    @Id
    String id;

    String type;

    Long value;

    @Column(columnDefinition = "TEXT")
    String description;

    Long pointCost;

    Long minOrderValue;

}
