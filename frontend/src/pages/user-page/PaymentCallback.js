import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { handlePaymentCallback } from "../../services/paymentService";

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const queryParams = new URLSearchParams(location.search);
  const paramsObject = Object.fromEntries(queryParams.entries());

  console.log("Query params: ", queryParams);
  console.log("Params Object ", paramsObject);

  const userId = user.id;

  useEffect(() => {
    const processCallback = async () => {
      if (Object.keys(paramsObject).length > 0) {
        const response = await handlePaymentCallback(userId, paramsObject);
        console.log("Callback response:", response);
        navigate("/success-payment");
      } else {
        console.error("No parameters found in the URL.");
      }
    };

    processCallback();
  }, [paramsObject, userId, navigate]);

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row>
        <Col className="text-center">
          <Spinner animation="border" />
          <h4>Loading...</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCallback;
