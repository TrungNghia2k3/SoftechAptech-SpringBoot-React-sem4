package com.ntn.ecommerce.dto.response;

import java.util.List;

import com.ntn.ecommerce.entity.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishlistResponse {
    List<Product> products;
}
