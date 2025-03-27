package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.CouponRequest;
import com.devteria.identityservice.dto.response.CouponResponse;
import com.devteria.identityservice.dto.response.UserCouponsResponse;
import com.devteria.identityservice.entity.Coupon;
import com.devteria.identityservice.entity.UserCoupons;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserCouponsMapper {
    UserCouponsResponse toUserCouponsResponse(UserCoupons userCoupons);
}
