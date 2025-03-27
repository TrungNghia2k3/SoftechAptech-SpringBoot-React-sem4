package com.devteria.identityservice.dto.response;


import com.devteria.identityservice.entity.Coupon;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCouponsResponse {
    Long id;
    Coupon coupon;
    Integer quantity;
}
