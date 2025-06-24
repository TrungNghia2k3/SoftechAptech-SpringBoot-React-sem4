package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.CouponRequest;
import com.ntn.ecommerce.dto.response.CouponResponse;
import com.ntn.ecommerce.entity.Coupon;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    Coupon toCoupon(CouponRequest request);

    CouponResponse toCouponResponse(Coupon coupon);

    void updateCoupon(@MappingTarget Coupon coupon, CouponRequest request);
}
