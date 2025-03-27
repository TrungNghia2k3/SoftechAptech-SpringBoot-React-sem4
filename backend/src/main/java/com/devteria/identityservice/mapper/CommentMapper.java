package com.devteria.identityservice.mapper;

import com.devteria.identityservice.dto.request.CommentRequest;
import com.devteria.identityservice.dto.response.CommentResponse;
import com.devteria.identityservice.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommentMapper {


    Comment toComment (CommentRequest request);

   // @Mapping(source = "adminResponse", target = "adminResponse")
    CommentResponse toCommentResponse(Comment comment);
    void updateComment (@MappingTarget Comment comment, CommentRequest request);
}
