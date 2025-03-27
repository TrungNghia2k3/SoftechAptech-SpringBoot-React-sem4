import React from "react";
import { Button, Row, Col } from "react-bootstrap";

const LoadMoreButton = ({ onClick, isVisible }) => {
  return (
    isVisible && (
      <Row className="mt-3">
        <Col className="text-center">
          <Button onClick={onClick}>Load More</Button>
        </Col>
      </Row>
    )
  );
};

export default LoadMoreButton;
