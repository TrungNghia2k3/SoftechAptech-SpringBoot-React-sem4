package com.ntn.ecommerce.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Builder
@Table(name = "manufacture_products")
public class ManufactureProducts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "manufacture_id", nullable = false)
    Manufacture manufacture;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    Integer quantity;

    LocalDate entryDate;

    Long priceOfUnits;
}
