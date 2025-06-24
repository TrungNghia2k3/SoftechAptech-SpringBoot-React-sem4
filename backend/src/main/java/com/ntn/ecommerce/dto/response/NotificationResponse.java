package com.ntn.ecommerce.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {

    Long id;
    String content;
    String orderId;
    LocalDateTime timestamp;
    boolean isRead;
}
