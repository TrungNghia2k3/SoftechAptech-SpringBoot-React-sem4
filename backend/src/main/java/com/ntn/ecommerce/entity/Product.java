package com.ntn.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Product {
    @Id
    String id;

    @Column(length = 100)
    String author;

    String title;

    LocalDate publicationDate;

    @Column(length = 50)
    String edition;

    @Column(length = 50)
    String language;

    @Column(length = 50)
    String formality;

    @Column(length = 20)
    String isbn10;

    @Column(length = 20)
    String isbn13;

    @Column(columnDefinition = "TEXT")
    String description;

    String status;
    String imageMain;
    String imageSubOne;
    String imageSubTwo;
    String audio; // new field
    Long price;
    Integer soldItems;
    Integer inStock;
    Integer pageNumber;
    BigDecimal weight;
    BigDecimal thickness;
    BigDecimal width;
    BigDecimal length;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    Category category;

    @ManyToOne
    @JoinColumn(name = "publisher_id")
    @JsonBackReference
    Publisher publisher;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    Promotion promotion;
}
