package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.UserAddressRequest;
import com.devteria.identityservice.dto.response.UserAddressResponse;
import com.devteria.identityservice.entity.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

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
