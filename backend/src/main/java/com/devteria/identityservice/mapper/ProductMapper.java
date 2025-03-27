package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.UpdateProductRequest;
import com.devteria.identityservice.dto.response.CategoryResponse;
import com.devteria.identityservice.dto.response.PublisherResponse;
import com.devteria.identityservice.entity.Category;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.Publisher;
import org.mapstruct.Mapper;

import com.devteria.identityservice.dto.request.ProductRequest;
import com.devteria.identityservice.dto.response.ProductResponse;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    ProductResponse toProductResponse(Product product);

    void updateProductFromRequest(@MappingTarget Product product, ProductRequest request);
}
