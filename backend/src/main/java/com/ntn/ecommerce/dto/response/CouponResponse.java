package com.ntn.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponResponse {
    String id;

    String type;

    Long value;

    String description;

    Long pointCost;

    Long minOrderValue;
}
