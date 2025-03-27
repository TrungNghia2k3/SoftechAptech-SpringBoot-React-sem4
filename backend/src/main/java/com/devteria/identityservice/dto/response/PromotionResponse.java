package com.devteria.identityservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionResponse {
    Long id;
    Integer discountPercentage;
    LocalDate startDate;
    LocalDate endDate;
}
