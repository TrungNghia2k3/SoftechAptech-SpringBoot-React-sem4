package com.ntn.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ProductResponse {
    String id;
    String author;
    String title;
    LocalDate publicationDate;
    String edition;
    String language;
    String formality;
    String isbn10;
    String isbn13;
    String description;
    String status;
    String imageMain;
    String imageSubOne;
    String imageSubTwo;
    String audio;
    Long price;
    Integer soldItems;
    Integer inStock;
    Integer pageNumber;
    BigDecimal weight;
    BigDecimal thickness;
    BigDecimal width;
    BigDecimal length;
    CategoryResponse category;
    PublisherResponse publisher;
    PromotionResponse promotion;
}
