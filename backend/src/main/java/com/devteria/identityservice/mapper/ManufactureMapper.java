package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.ManufactureRequest;
import com.devteria.identityservice.dto.response.ManufactureResponse;
import com.devteria.identityservice.entity.Manufacture;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ManufactureMapper {

    @Mapping(source = "name", target = "name")
    Manufacture toManufacture(ManufactureRequest request);
    ManufactureResponse toManufactureResponse(Manufacture manufacture);

    void updateManufacture(@MappingTarget Manufacture manufacture, ManufactureRequest request);
}
