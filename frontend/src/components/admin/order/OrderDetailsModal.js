import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  formatCurrencyVND,
  formatDateWithAmPm,
  formatLeadTime,
} from "../../../utilities/Utils";

const OrderDetailsModal = ({
  showModal,
  handleCloseModal,
  selectedOrder,
  newStatus,
  handleStatusChange,
  handleSubmit,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <p>
              <strong>ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {formatDateWithAmPm(selectedOrder.orderDate)}
            </p>
            <p>
              <strong>Shipping Fee:</strong>{" "}
              {formatCurrencyVND(selectedOrder.shippingFee)}
            </p>
            <p>
              <strong>Amount:</strong> {formatCurrencyVND(selectedOrder.amount)}{" "}
            </p>
            <p>
              <strong>Discount Amount:</strong>{" "}
              {selectedOrder.discountAmount
                ? formatCurrencyVND(selectedOrder.discountAmount)
                : 0}{" "}
            </p>
            <p>
              <strong>Total Amount:</strong>{" "}
              {formatCurrencyVND(selectedOrder.totalAmount)}
            </p>
            <p>
              <strong>Lead Time:</strong>{" "}
              {formatLeadTime(selectedOrder.leadTime)}
            </p>
            <hr />
            <p>
              <strong className="fs-5">Customer Information:</strong>
            </p>
            <p>
              <strong>Full Name:</strong> {selectedOrder.userAddress.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.userAddress.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {`${selectedOrder.userAddress.fullAddress}, ${selectedOrder.userAddress.wardName}, ${selectedOrder.userAddress.districtName}, ${selectedOrder.userAddress.provinceName}`}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong className="fs-5">Payment Method:</strong>{" "}
              {selectedOrder.payment.paymentMethod}
            </p>
            <hr />
            <p>
              <strong className="fs-5">Order Products:</strong>
            </p>
            {selectedOrder.cart.cartProducts.map((product, index) => (
              <div key={index}>
                <p>
                  <strong>Product Title:</strong> {product.product.title}
                </p>
                <p>
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  {formatCurrencyVND(product.totalPrice)}
                </p>
                {index < selectedOrder.cart.cartProducts.length - 1 && <hr />}
              </div>
            ))}
            <hr />
            <Form.Group controlId="orderStatus">
              <Form.Label>
                <strong className="fs-5">Order Status:</strong>
              </Form.Label>
              <Form.Select
                aria-label="Select order status"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="ORDER_PLACED">ORDER_PLACED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
