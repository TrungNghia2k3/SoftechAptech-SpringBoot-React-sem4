import React from "react";
import { Button, Card } from "react-bootstrap";
import { Gift } from "react-bootstrap-icons";
import { formatCurrencyVND } from "../../../utilities/Utils";
import { redeemCoupon } from "../../../services/couponService";
import { toast } from "react-toastify";

const RedeemCouponCard = ({
  id,
  type,
  value,
  description,
  pointCost,
  minOrderValue,
  userId,
  onRedeemSuccess,
}) => {
  const handleRedeem = async () => {
    try {
      console.log(id, userId);
      await redeemCoupon(id, userId);
      toast.success("Coupon redeemed successfully!");
      onRedeemSuccess(pointCost); // Update user's points
    } catch (error) {
      if (error.response.data.code === 1038) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to redeem coupon. Please try again.");
        console.log(error);
      }
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Gift className="me-3" size={40} />
          <div>
            <Card.Text className="m-0">
              Coupon Code: {id} - Type: {type} - Point Cost: {pointCost}
            </Card.Text>
            <Card.Text className="m-0">
              Value:{" "}
              {type === "AMOUNT"
                ? `${formatCurrencyVND(value)}`
                : type === "PERCENTAGE"
                ? `${value}%`
                : "Freeship"}
            </Card.Text>
            <Card.Text className="m-0">Description: {description}</Card.Text>
            <Card.Text className="m-0">Min Order Value: {formatCurrencyVND(minOrderValue)}</Card.Text>
          </div>
        </div>
        <Button variant="primary" onClick={handleRedeem}>
          Redeem Coupon
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RedeemCouponCard;
