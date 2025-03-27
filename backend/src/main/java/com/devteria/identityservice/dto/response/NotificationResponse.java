package com.devteria.identityservice.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

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
