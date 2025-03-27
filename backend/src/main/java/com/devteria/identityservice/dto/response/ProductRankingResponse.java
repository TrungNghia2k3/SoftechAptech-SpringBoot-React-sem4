package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRankingResponse {
    Product product;
    Long totalQuantity;
}
