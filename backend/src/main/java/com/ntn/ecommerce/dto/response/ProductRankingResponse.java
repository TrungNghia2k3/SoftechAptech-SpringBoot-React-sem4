package com.ntn.ecommerce.dto.response;

import com.ntn.ecommerce.entity.Product;

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
