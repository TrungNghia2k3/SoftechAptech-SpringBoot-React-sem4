package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.response.NotificationResponse;
import com.devteria.identityservice.entity.Notification;
import com.devteria.identityservice.repository.NotificationRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationService {

    NotificationRepository notificationRepository;

    public List<NotificationResponse> getAllNotificationsByUserId(String userId) {

        // Lấy danh sách thông báo từ repository
        List<Notification> notifications = notificationRepository.findByUserId(userId);

        // Sắp xếp danh sách thông báo trước tiên theo isRead (chưa đọc trước), sau đó theo timestamp (mới nhất trước)
        notifications.sort(Comparator
                .comparing(Notification::isRead)
                .thenComparing(Comparator.comparing(Notification::getTimestamp).reversed()));

        // Chuyển đổi danh sách thông báo thành danh sách NotificationResponse
        return notifications.stream()
                .map(notification -> new NotificationResponse(
                        notification.getId(),
                        notification.getContent(),
                        notification.getOrder().getId(), // assuming order ID is Long or another type that requires conversion to String
                        notification.getTimestamp(),
                        notification.isRead()))
                .collect(Collectors.toList());
    }

    public void markAllNotificationsAsRead(String userId) {
        notificationRepository.updateAllNotificationsToRead(userId);
    }
}
