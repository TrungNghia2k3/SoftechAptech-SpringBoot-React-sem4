import React from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";

const FAQs = () => {
  return (
    <>
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid bg-white py-2">
        <Container>
          <h1 className="display-3">Welcome to Book Store!</h1>
          <p className="lead fs-3">How can we help you?</p>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <Row>
          <Col>
            <h3 className="my-3">Frequently asked questions</h3>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  How many days will it take to deliver the order?
                </Accordion.Header>
                <Accordion.Body>
                  Depends on the Order, Quantity and Stock and as well on the
                  payment type chosen, as if the payment option chosen is
                  payment before delivery, then the order will only be
                  dispatched after the receipt of the payment.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  What if the order delivered is not in proper condition?{" "}
                </Accordion.Header>
                <Accordion.Body>
                  If the order delivered is improper, it will be replace with
                  the other.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Can an Order be cancelled? If yes, will there be any charges?
                </Accordion.Header>
                <Accordion.Body>
                  Yes, but if cancelled with in 24 Hrs. there will be no
                  charges, but if cancelled after 24 Hrs. and if the Order is
                  being dispatched the Delivery charges for the to and fro is to
                  be bared by the one who has ordered.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  Will there be any charges for the delivery apart from the
                  products ordered?
                </Accordion.Header>
                <Accordion.Body>
                  There will be an additional shipping fee for delivery,
                  separate from the cost of the products ordered.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  How can the payment be made?
                </Accordion.Header>
                <Accordion.Body>
                  Payments can be made via Cash on Delivery (COD) or through
                  VNPAY.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FAQs;
