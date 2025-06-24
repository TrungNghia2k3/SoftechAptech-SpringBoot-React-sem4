package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.UserCreationRequest;
import com.ntn.ecommerce.dto.request.UserUpdateRequest;
import com.ntn.ecommerce.dto.response.UserResponse;
import com.ntn.ecommerce.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
