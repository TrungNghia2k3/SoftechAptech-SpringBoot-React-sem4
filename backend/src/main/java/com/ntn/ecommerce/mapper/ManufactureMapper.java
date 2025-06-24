package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.ManufactureRequest;
import com.ntn.ecommerce.dto.response.ManufactureResponse;
import com.ntn.ecommerce.entity.Manufacture;

@Mapper(componentModel = "spring")
public interface ManufactureMapper {

    @Mapping(source = "name", target = "name")
    Manufacture toManufacture(ManufactureRequest request);

    ManufactureResponse toManufactureResponse(Manufacture manufacture);

    void updateManufacture(@MappingTarget Manufacture manufacture, ManufactureRequest request);
}
