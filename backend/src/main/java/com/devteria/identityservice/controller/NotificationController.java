package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.NotificationResponse;
import com.devteria.identityservice.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    @GetMapping("/{userId}")
    public ApiResponse<List<NotificationResponse>> getAllNotificationsByUserId(@PathVariable String userId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getAllNotificationsByUserId(userId))
                .build();
    }

    @PutMapping("/markAllAsRead/{userId}")
    public ApiResponse<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllNotificationsAsRead(userId);
        return ApiResponse.<Void>builder()
                .message("Marked all notifications as read")
                .build();
    }
}
