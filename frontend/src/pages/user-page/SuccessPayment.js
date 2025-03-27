// src/components/SuccessPayment.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Alert } from "react-bootstrap";

const SuccessPayment = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/user/order-tracking");
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Alert variant="success" className="text-center">
        <Alert.Heading>Payment Successful!</Alert.Heading>
        <p>
          Your payment has been processed successfully. Thank you for your
          purchase!
        </p>
      </Alert>
      <Button variant="primary" onClick={handleHomeClick} className="mt-4">
        Go to Order Tracking
      </Button>
    </Container>
  );
};

export default SuccessPayment;
