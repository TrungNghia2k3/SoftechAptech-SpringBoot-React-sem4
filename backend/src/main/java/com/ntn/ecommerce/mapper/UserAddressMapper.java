package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.UserAddressRequest;
import com.ntn.ecommerce.dto.response.UserAddressResponse;
import com.ntn.ecommerce.entity.UserAddress;

@Mapper(componentModel = "spring")
public interface UserAddressMapper {

    UserAddress toUserAddress(UserAddressRequest request);

    @Mapping(source = "default", target = "isDefault")
    UserAddressResponse toUserAddressResponse(UserAddress userAddress);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(source = "default", target = "default")
    void updateUserAddressFromRequest(UserAddressRequest request, @MappingTarget UserAddress address);
}
