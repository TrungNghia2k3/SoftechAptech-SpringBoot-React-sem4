package com.ntn.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.ntn.ecommerce.dto.request.CommentRequest;
import com.ntn.ecommerce.dto.response.CommentResponse;
import com.ntn.ecommerce.entity.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    Comment toComment(CommentRequest request);

    // @Mapping(source = "adminResponse", target = "adminResponse")
    CommentResponse toCommentResponse(Comment comment);

    void updateComment(@MappingTarget Comment comment, CommentRequest request);
}
