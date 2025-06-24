package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.PublisherRequest;
import com.ntn.ecommerce.dto.response.PublisherResponse;
import com.ntn.ecommerce.entity.Publisher;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    Publisher toPublisher(PublisherRequest request);

    @Mapping(source = "disabled", target = "disabled") // ánh xạ chính xác
    PublisherResponse toPublisherResponse(Publisher publisher);

    void updatePublisher(@MappingTarget Publisher publisher, PublisherRequest request);
}
