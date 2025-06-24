package com.ntn.ecommerce.dto.response;

import java.time.LocalDate;

import com.ntn.ecommerce.entity.Manufacture;
import com.ntn.ecommerce.entity.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
