package com.devteria.identityservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductManufactureDetailResponse {
    Long id;
    String manufactureName;
    Integer quantity;
    Long priceOfUnits;
    LocalDate entryDate;
    String productId;
}
