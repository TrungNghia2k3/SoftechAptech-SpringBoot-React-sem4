package com.devteria.identityservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {

    @NotEmpty
    String author;

    @NotEmpty
    String title;

    LocalDate publicationDate;

    @NotEmpty
    String edition;

    @NotEmpty
    String language;

    @NotEmpty
    String formality;

    String isbn10; // 1

    @NotEmpty
    String isbn13; // 1

    @NotEmpty
    String description; // 1

    @NotNull
    Long price;

    @NotNull
    Integer pageNumber;

    @NotNull
    BigDecimal weight;

    @NotNull
    BigDecimal thickness;

    @NotNull
    BigDecimal width;

    @NotNull
    BigDecimal length;

    @NotNull
    Long categoryId;

    @NotNull
    Long publisherId;

}
