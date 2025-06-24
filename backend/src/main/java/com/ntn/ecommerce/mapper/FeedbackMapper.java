package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ntn.ecommerce.dto.request.FeedbackRequest;
import com.ntn.ecommerce.dto.response.FeedbackResponse;
import com.ntn.ecommerce.entity.Feedback;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    @Mapping(source = "email", target = "email")
    Feedback toFeedback(FeedbackRequest request);

    FeedbackResponse toFeedbackResponse(Feedback feedback);
}
