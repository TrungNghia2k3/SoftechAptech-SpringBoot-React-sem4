package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.PublisherRequest;
import com.devteria.identityservice.dto.response.PublisherResponse;
import com.devteria.identityservice.entity.Publisher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    Publisher toPublisher(PublisherRequest request);

    @Mapping(source = "disabled", target = "disabled") // ánh xạ chính xác
    PublisherResponse toPublisherResponse(Publisher publisher);

    void updatePublisher(@MappingTarget Publisher publisher, PublisherRequest request);
}
