package com.devteria.identityservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponRequest {
    @NotEmpty
    String id;

    @NotEmpty
    String type;

    @NotNull
    @Min(value = 0)
    Long value;

    @NotEmpty
    String description;

    @NotNull
    @Positive
    Long pointCost;

    @NotNull
    @Positive
    Long minOrderValue;
}
