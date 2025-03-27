import React, { useEffect } from "react";
import { Card, Form } from "react-bootstrap";

const PaymentMethod = ({
  selectedPaymentMethod,
  onPaymentMethodChange,
  totalPayment,
}) => {
  useEffect(() => {
    if (totalPayment === 0) {
      onPaymentMethodChange({ target: { value: "COD" } });
    }
  }, [totalPayment, onPaymentMethodChange]);

  return (
    <div className="mt-3">
      <Card>
        <Card.Body>
          <h5>PAYMENT METHOD</h5>
          <Form.Check
            type="radio"
            label="Cash on Delivery"
            name="paymentMethod"
            value="COD"
            checked={selectedPaymentMethod === "COD"}
            onChange={(e) => onPaymentMethodChange(e)}
          />
          {totalPayment > 0 && (
            <Form.Check
              type="radio"
              label="VNPAY"
              name="paymentMethod"
              value="VNPAY"
              checked={selectedPaymentMethod === "VNPAY"}
              onChange={(e) => onPaymentMethodChange(e)}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentMethod;

