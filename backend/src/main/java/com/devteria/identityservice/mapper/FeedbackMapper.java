package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.FeedbackRequest;
import com.devteria.identityservice.dto.response.FeedbackResponse;
import com.devteria.identityservice.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    @Mapping(source = "email", target = "email")

    Feedback toFeedback(FeedbackRequest request);

    FeedbackResponse toFeedbackResponse(Feedback feedback);
}
