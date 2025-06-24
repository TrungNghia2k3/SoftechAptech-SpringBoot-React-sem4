package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.ntn.ecommerce.dto.response.OrderResponse;
import com.ntn.ecommerce.entity.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderResponse toOrderResponse(Order order);
}
