import React from "react";
import { Card, Form } from "react-bootstrap";

const CouponList = ({ coupons, onCouponChange, selectedCoupons }) => {
  // Các hàm phụ trợ để kiểm tra các loại mã giảm giá
  const isAmountSelected = (coupon) =>
    coupon.type === "AMOUNT" && selectedCoupons.amount === coupon;
  const isPercentageSelected = (coupon) =>
    coupon.type === "PERCENTAGE" && selectedCoupons.percentage === coupon;
  const isFreeShipSelected = (coupon) =>
    coupon.type === "FREESHIP" && selectedCoupons.freeShip === coupon;

  // Kiểm tra sự tồn tại của các loại coupon
  const hasDiscountCoupons = coupons.some(
    (coupon) =>
      coupon.coupon.type === "AMOUNT" || coupon.coupon.type === "PERCENTAGE"
  );
  const hasFreeShipCoupons = coupons.some(
    (coupon) => coupon.coupon.type === "FREESHIP"
  );

  // Hàm để render các coupon theo loại
  const renderDiscountCoupons = () =>
    coupons
      .filter(
        (coupon) =>
          coupon.coupon.type === "AMOUNT" || coupon.coupon.type === "PERCENTAGE"
      )
      .map((coupon) => (
        <Card key={coupon.id} style={{ margin: "12px 0" }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <Form.Check
                className="mb-0"
                type="checkbox"
                label={coupon.coupon.description}
                checked={
                  (coupon.coupon.type === "AMOUNT" &&
                    isAmountSelected(coupon.coupon)) ||
                  (coupon.coupon.type === "PERCENTAGE" &&
                    isPercentageSelected(coupon.coupon))
                }
                onChange={() =>
                  onCouponChange(coupon.coupon.type, coupon.coupon)
                }
              />
            </div>
          </Card.Body>
        </Card>
      ));

  const renderFreeShipCoupons = () =>
    coupons
      .filter((coupon) => coupon.coupon.type === "FREESHIP")
      .map((coupon) => (
        <Card key={coupon.id} style={{ margin: "12px 0" }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <Form.Check
                className="mb-0"
                type="checkbox"
                label="Free shipping"
                checked={isFreeShipSelected(coupon.coupon)}
                onChange={() => onCouponChange("FREESHIP", coupon.coupon)}
              />
            </div>
          </Card.Body>
        </Card>
      ));

  return (
    <div
      className="coupon-list bg-white p-3 mt-3"
      style={{ border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h5>AVAILABLE COUPONS</h5>

      <div className="discount-form">
        {hasDiscountCoupons && <h6>Discount Coupon</h6>}
        {renderDiscountCoupons()}
      </div>

      <div className="freeship-form">
        {hasFreeShipCoupons && <h6>Free Shipping Coupon</h6>}
        {renderFreeShipCoupons()}
      </div>
    </div>
  );
};

export default CouponList;
