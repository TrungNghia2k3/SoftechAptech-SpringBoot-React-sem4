import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatCurrencyVND } from "../../../utilities/Utils";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Link to={`/product/${product.id}`} className="text-decoration-none">
        <Card className="h-100 p-0 product-card">
          <Card.Img
            variant="top"
            src={product.image_main}
            alt={product.title}
            className="card-img"
          />
          <Card.Body>
            <Card.Title className="card-title">{product.title}</Card.Title>
            <Card.Text className="card-text-price">
              {formatCurrencyVND(product.price)}
            </Card.Text>
            <Card.Text className="card-text-sold">
              Sold items: {product.sold_items}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

export default ProductCard;
