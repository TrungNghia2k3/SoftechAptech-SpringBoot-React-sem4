import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotificationCard from "../../components/user/notification/NotificationCard";
import { getAllNotificationsByUserId } from "../../services/notificationsService";
import { Link } from "react-router-dom";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user.id;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getAllNotificationsByUserId(userId);
        setNotifications(data.result);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <>
      <h3 className="fw-bold">Notification</h3>

      {notifications.map((notification) => (
        <Link
          to={`/user/order/${notification.orderId}`}
          className="text-decoration-none"
        >
          <NotificationCard
            key={notification.id}
            content={notification.content}
            timestamp={notification.timestamp}
          />
        </Link>
      ))}
    </>
  );
};

export default NotificationsList;
