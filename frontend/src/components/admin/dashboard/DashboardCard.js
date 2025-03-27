import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, value, icon, link }) => (
  <Col>
    <Link to={link} className="text-decoration-none">
      <Card className="m-1">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Text className="text-muted">{title}</Card.Text>
            <Card.Text className="fw-bold fs-5">{value}</Card.Text>
          </div>
          <div className="display-4">{icon}</div>
        </Card.Body>
      </Card>
    </Link>
  </Col>
);

export default DashboardCard;
