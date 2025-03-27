package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.CategoryRequest;
import com.devteria.identityservice.dto.response.CategoryResponse;
import com.devteria.identityservice.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    @Mapping(source = "disabled", target = "disabled")
    CategoryResponse toCategoryResponse(Category category);

    void updateCategory(CategoryRequest request, @MappingTarget Category category);
}
