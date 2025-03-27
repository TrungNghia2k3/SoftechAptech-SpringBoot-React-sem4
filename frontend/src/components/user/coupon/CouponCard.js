import React from "react";
import { Card } from "react-bootstrap";
import { Ticket } from "react-bootstrap-icons";
import { formatCurrencyVND } from "../../../utilities/Utils";
const CouponCard = ({
  id,
  type,
  value,
  description,
  quantity,
  minOrderValue,
}) => {
  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center">
        <Ticket className="me-3" size={40} /> {/* Handbag icon */}
        <div>
          <Card.Text className="text-primary m-0">
            Coupon Code: {id} - Type: {type} - Quantity: {quantity}
          </Card.Text>
          <Card.Text className="m-0">
            {" "}
            Value:{" "}
            {type === "AMOUNT"
              ? `${formatCurrencyVND(value)}`
              : type === "PERCENTAGE"
              ? `${value}%`
              : "Freeship"}
          </Card.Text>
          <Card.Text className="m-0">Description: {description}</Card.Text>
          <Card.Text className="m-0">
            Min Order Value: {formatCurrencyVND(minOrderValue)}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CouponCard;
