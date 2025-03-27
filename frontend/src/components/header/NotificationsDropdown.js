import React, { useState, useEffect } from "react";
import { Dropdown, Button, Card, Badge } from "react-bootstrap";
import { BellFill, InfoCircleFill } from "react-bootstrap-icons";
import "./NotificationsDropdown.scss";
import { useSelector } from "react-redux";
import {
  getAllNotificationsByUserId,
  markAllNotificationsAsRead,
} from "../../services/notificationsService";
import { Link } from "react-router-dom";

const NotificationsDropdown = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getAllNotificationsByUserId(userId);
      const allNotifications = data.result || [];
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.read).length);
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAllAsRead = async () => {
    // Set all notifications as read
    await markAllNotificationsAsRead(userId);
    // Update notifications state
    const data = await getAllNotificationsByUserId(userId);
    const allNotifications = data.result || [];
    setNotifications(allNotifications);
    setUnreadCount(0); // After setting all as read, unread count should be zero
  };

  return (
    <Dropdown
      align="end"
      className="notifications-dropdown"
      onClick={handleMarkAllAsRead}
    >
      <Dropdown.Toggle as={Button} variant="dark" className="notification-icon">
        <BellFill />
        {unreadCount > 0 && (
          <Badge bg="danger" className="notification-badge">
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="notifications-dropdown-menu p-0">
        {notifications.length === 0 && (
          <Dropdown.Item className="text-center">
            No new notifications
          </Dropdown.Item>
        )}

        {notifications.slice(0, 5).map((notification) => (
          <Dropdown.Item key={notification.id} className="p-0">
            <Link
              to={`/user/order/${notification.orderId}`}
              className="text-decoration-none"
            >
              <Card className="notification-card">
                <Card.Body className="d-flex align-items-start p-2">
                  <InfoCircleFill className="notification-icon-left me-2" />
                  <Card.Text className="notification-content mb-0">
                    {notification.content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Dropdown.Item>
        ))}
        <div className="text-center bg-white">
          <Button
            href="/user/notification"
            variant="link"
            className="view-notification-button text-decoration-none text-center"
          >
            View All
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
