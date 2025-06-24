package com.ntn.ecommerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.NotificationResponse;
import com.ntn.ecommerce.service.NotificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

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
