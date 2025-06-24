package com.ntn.ecommerce.entity;

import java.util.List;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 20)
    String code;

    @Column(length = 100)
    String name;

    @Column(columnDefinition = "TINYINT(1)", nullable = false)
    boolean isDisabled;

    @OneToMany(mappedBy = "publisher")
    @JsonManagedReference
    List<Product> products;
}
