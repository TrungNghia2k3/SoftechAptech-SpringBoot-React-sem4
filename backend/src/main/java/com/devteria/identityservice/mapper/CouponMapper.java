package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.CouponRequest;
import com.devteria.identityservice.dto.response.CouponResponse;
import com.devteria.identityservice.entity.Coupon;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    Coupon toCoupon(CouponRequest request);

    CouponResponse toCouponResponse(Coupon coupon);

    void updateCoupon(@MappingTarget Coupon coupon, CouponRequest request);
}
