package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Manufacture;
import com.devteria.identityservice.entity.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ManufactureProductsResponse {
    Long id;
    Manufacture manufacture;
    Product product;
    Integer quantity;
    LocalDate entryDate;
    Long priceOfUnits;
}
