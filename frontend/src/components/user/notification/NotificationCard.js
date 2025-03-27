import React from "react";
import { Card } from "react-bootstrap";
import { BsHandbag } from "react-icons/bs"; // Using react-icons for the handbag icon
import { formatNotificationDate } from "../../../utilities/Utils";

const NotificationCard = ({ content, timestamp }) => {
  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center">
        <BsHandbag className="me-3" size={30} /> {/* Handbag icon */}
        <div>
          <Card.Text>{content}</Card.Text>
          <Card.Subtitle className="text-muted">
          {formatNotificationDate(timestamp)}
            {/* Formatting the timestamp */}
          </Card.Subtitle>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotificationCard;
