package com.ntn.ecommerce.dto.response;

import java.time.LocalDateTime;

import com.ntn.ecommerce.entity.Product;
import com.ntn.ecommerce.entity.User;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
