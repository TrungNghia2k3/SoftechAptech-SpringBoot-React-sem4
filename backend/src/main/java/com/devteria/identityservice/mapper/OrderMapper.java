package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.CategoryRequest;
import com.devteria.identityservice.dto.response.CategoryResponse;
import com.devteria.identityservice.dto.response.OrderResponse;
import com.devteria.identityservice.entity.Category;
import com.devteria.identityservice.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderResponse toOrderResponse(Order order);
}
