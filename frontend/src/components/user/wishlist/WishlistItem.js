import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatCurrencyVND } from "../../../utilities/Utils";

const WishlistItem = ({ product, onAddToCart, onRemoveFromWishlist }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="align-items-center">
          {/* Ảnh */}
          <Col xs={4} md={1} className="text-center">
            <Link
              to={`/product/${product.id}`}
              className="text-decoration-none"
            >
              <Card.Img
                variant="top"
                src={`http://localhost:8080/api/images/product/${product.id}/${product.imageMain}`}
                alt={product.title}
                style={{
                  width: "100px",
                  height: "100px",
                }}
                className="img-fluid"
              />
            </Link>
          </Col>

          {/* Nội dung */}
          <Col xs={5} md={9}>
            <Link
              to={`/product/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <Card.Text>{product.title}</Card.Text>
              <Card.Text className="text-danger">Price: {formatCurrencyVND(product.price)}</Card.Text>
            </Link>
          </Col>

          {/* 2 Button */}
          <Col xs={3} md={2} className="text-end">
            <Button
              variant="primary"
              className="mb-2"
              onClick={() => onAddToCart(product.id)}
            >
              Add to cart
            </Button>
            <br />
            <Button
              variant="link"
              className="text-decoration-none text-muted p-0"
              onClick={() => onRemoveFromWishlist(product.id)}
            >
              Delete product
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WishlistItem;
