package com.devteria.identityservice.dto.response;

import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long id;
    User user;
    Product product;
    String content;
    Integer stars;
    LocalDateTime createdDate;
    String adminResponse;
}
