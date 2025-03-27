package com.devteria.identityservice.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
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
