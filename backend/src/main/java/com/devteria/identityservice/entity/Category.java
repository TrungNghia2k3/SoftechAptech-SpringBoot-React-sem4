package com.devteria.identityservice.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 100)
    String name;

    @Column(length = 20)
    String code;

    String image;

    @Column(columnDefinition = "TINYINT(1)")
    boolean isDisabled;

    @OneToMany(mappedBy = "category")
    @JsonManagedReference
    List<Product> products;
}
