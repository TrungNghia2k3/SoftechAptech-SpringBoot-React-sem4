import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { BsHouseAddFill, BsTelephoneFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById } from "../../../services/orderService";
import {
  formatCurrencyVND,
  formatDateWithAmPm
} from "../../../utilities/Utils";
import "./OrderDetail.scss";

const OrderDetail = () => {
  const { id } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.result); // Lưu kết quả vào state
      } catch (error) {
        toast.error("Failed to fetch order details.");
      }
    };

    fetchOrder();
  }, [id]);

  // Hàm để xác định màu sắc của Badge dựa trên trạng thái của đơn hàng
  const getBadgeVariant = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "info";
      case "SHIPPED":
        return "primary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="order-info-card">
        <Card.Body>
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  <h5 className="fw-bold">Order #{order.id}</h5>
                  <Badge
                    bg={getBadgeVariant(order.orderStatus)}
                    className="ms-2 mb-2"
                    style={{ padding: "8px 4px" }}
                  >
                    {order.orderStatus}
                  </Badge>
                </div>
                <p className="text-muted">
                  Date of purchase: {formatDateWithAmPm(order.orderDate)}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="order-info-detail">
            <Col lg={5} className="recipient-information">
              <Card className="h-100">
                <Card.Body>
                  <h6 className="fw-bold mb-3"> Recipient Information</h6>
                  <p className="m-0">{order.userAddress.fullName}</p>
                  <p className="m-0">
                    <BsTelephoneFill className="mb-1" /> Tel:{" "}
                    {order.userAddress.phone}
                  </p>
                  <p className="m-0">
                    <BsHouseAddFill className="mb-1" /> Address:{" "}
                    {order.userAddress.fullAddress}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} className="payment-method">
              <Card className="h-100">
                <Card.Body>
                  <h6 className="fw-bold">Payment Method</h6>
                  <p>{order.payment.paymentMethod}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="order-money-total">
              <Card className="h-100">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Order Money Total</h6>
                  <p className="m-0">
                    <strong>Subtotal Amount: </strong>{" "}
                    {formatCurrencyVND(order.amount + order.discountAmount)}
                  </p>
                  {/* <p className="m-0">
                    <strong>Subtotal Amount: </strong>{" "}
                    {formatCurrencyVND(order.amount)}
                  </p> */}
                  <p className="m-0">
                    <strong>Original Shipping Fee: </strong>
                    {formatCurrencyVND(order.shippingFee)}
                  </p>
                  <p className="m-0">
                    <strong>Discount Amount: </strong>{" "}
                    {formatCurrencyVND(order.discountAmount)}
                  </p>
                  <p className="m-0">
                    <strong>Grand Total: </strong>
                    <span className="fw-bold text-danger">
                      {formatCurrencyVND(order.totalAmount)}
                    </span>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="my-3">
        <Card.Body>
          <Table className="table-horizontal-only" responsive>
            <thead>
              <tr>
                <th>
                  <h6 className="text-muted">
                    Product ({order.cart.cartProducts.length})
                  </h6>
                </th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.cart.cartProducts.map((item) => (
                <tr>
                  <td>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="d-flex">
                        <img
                          loading="lazy"
                          src={`http://localhost:8080/api/images/product/${item.product.id}/${item.product.imageMain}`}
                          alt={item.product.title}
                          className="card-img"
                          style={{ width: "120px", height: "120px"}}
                        />
                        <p className="mt-0">{item.product.title}</p>
                      </div>
                    </Link>
                  </td>
                  <td>{formatCurrencyVND(item.product.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrencyVND(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderDetail;
