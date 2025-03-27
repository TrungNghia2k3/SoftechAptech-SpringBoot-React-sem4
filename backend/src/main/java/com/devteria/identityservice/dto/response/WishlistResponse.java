package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishlistResponse {
    List<Product> products;
}
