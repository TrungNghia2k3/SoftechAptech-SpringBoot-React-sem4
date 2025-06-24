package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.ntn.ecommerce.dto.response.UserCouponsResponse;
import com.ntn.ecommerce.entity.UserCoupons;

@Mapper(componentModel = "spring")
public interface UserCouponsMapper {
    UserCouponsResponse toUserCouponsResponse(UserCoupons userCoupons);
}
