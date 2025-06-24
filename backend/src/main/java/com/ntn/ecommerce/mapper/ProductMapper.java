package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.ProductRequest;
import com.ntn.ecommerce.dto.response.ProductResponse;
import com.ntn.ecommerce.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

    void updateProductFromRequest(@MappingTarget Product product, ProductRequest request);
}
