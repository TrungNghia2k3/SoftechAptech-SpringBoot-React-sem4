package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.CategoryRequest;
import com.ntn.ecommerce.dto.response.CategoryResponse;
import com.ntn.ecommerce.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    @Mapping(source = "disabled", target = "disabled")
    CategoryResponse toCategoryResponse(Category category);

    void updateCategory(CategoryRequest request, @MappingTarget Category category);
}
