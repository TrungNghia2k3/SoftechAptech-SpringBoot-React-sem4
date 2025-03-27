import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  ListGroup,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { addProductToCart } from "../../features/cart/cartSlice";
import { cancelOrder, getAllOrdersByUserId } from "../../services/orderService";
import {
  formatCurrencyVND,
  formatDateWithAmPm,
  formatLeadTime,
} from "../../utilities/Utils";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeKey, setActiveKey] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrdersByUserId(userId);
        setOrders(response.result);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (activeKey === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.orderStatus === activeKey
      );
      setFilteredOrders(filtered);
    }
  }, [activeKey, orders]);

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      try {
        // Hủy đơn hàng
        await cancelOrder(selectedOrder.id);

        // Cập nhật trạng thái đơn hàng trong state
        setOrders(orders.filter((order) => order.id !== selectedOrder.id));

        // Đặt lại trạng thái modal và đơn hàng đã chọn
        setSelectedOrder(null);
        setShowCancelModal(false);

        // Hiển thị thông báo thành công
        toast.success("Order cancelled successfully.");
        // Gọi lại hàm fetchOrders để cập nhật dữ liệu đơn hàng mới
        // move fetchOrders() inside useEffect or call it directly
        // ensure to define fetchOrders function at the top
        const fetchOrders = async () => {
          try {
            const response = await getAllOrdersByUserId(userId);
            setOrders(response.result);
          } catch (error) {
            console.error("Failed to fetch orders:", error);
          }
        };
        fetchOrders();
      } catch (error) {
        // Hiển thị thông báo lỗi
        toast.error("Failed to cancel order.");
      }
    }
  };

  const handleReorder = async (order) => {
    try {
      // Lặp qua các sản phẩm trong giỏ hàng
      for (const product of order.cart.cartProducts) {
        // Thực hiện dispatch với hàm addProductToCart
        const resultAction = await dispatch(
          addProductToCart({
            userId: userId,
            productId: product.product.id,
            quantity: product.quantity,
          })
        );

        // Kiểm tra kết quả hành động
        if (addProductToCart.fulfilled.match(resultAction)) {
          toast.success("Product added to cart successfully!");
        } else {
          // Xử lý lỗi nếu có
          if (resultAction.payload) {
            // Lỗi từ phía server
            toast.error(
              resultAction.payload + ". Please check your shopping cart again"
            );
          } else {
            // Lỗi khác (mạng, không phản hồi, v.v.)
            toast.error("Failed to add product to cart.");
          }
        }
      }
    } catch (error) {
      // Xử lý lỗi không mong đợi
      toast.error("An unexpected error occurred.");
    }
  };

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

  const renderOrderItems = (order) => (
    <Card key={order.id} className="mb-3">
      <Card.Body>
        <Link to={`/user/order/${order.id}`} className="text-decoration-none">
          <div className="d-flex justify-content-between">
            <Card.Text className="m-0 text-primary">
              #{order.id}{" "}
              <Badge bg={getBadgeVariant(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </Card.Text>
            <Card.Text className="m-0 text-muted">
              {formatDateWithAmPm(order.orderDate)}
            </Card.Text>
          </div>
          <ListGroup>
            {order.cart.cartProducts.map((product) => (
              <ListGroup.Item
                key={product.id}
                className="d-flex my-2 border border-1"
              >
                <img
                  src={`http://localhost:8080/api/images/product/${product.product.id}/${product.product.imageMain}`}
                  alt={product.product.title}
                  style={{ width: "100px", height: "100px" }}
                />
                <div className="ms-2">
                  {product.product.title}{" "}
                  <span className="fw-bold">x{product.quantity}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Link>
        <div className="d-flex justify-content-between">
          {(activeKey === "ORDER_PLACED" || activeKey === "SHIPPED") && (
            <Card.Text>
              The expected delivery date is {formatLeadTime(order.leadTime)}
            </Card.Text>
          )}
          <Card.Text className="fw-bold">
            Order Money Total: {formatCurrencyVND(order.totalAmount)}
          </Card.Text>
        </div>
        <div className="text-end">
          {(activeKey === "DELIVERED" || activeKey === "CANCELLED") && (
            <Button
              variant="primary"
              className="me-2"
              onClick={() => handleReorder(order)}
            >
              Reorder
            </Button>
          )}
          {activeKey === "ORDER_PLACED" && order.payment.paymentMethod === "COD" && (
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedOrder(order);
                setShowCancelModal(true);
              }}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <h3 className="fw-bold">Order Tracking</h3>
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        transition={false}
        id="order-status-tabs"
        className="mb-3"
      >
        <Tab eventKey="all" title="All">
          {orders.map(renderOrderItems)}
        </Tab>
        <Tab eventKey="ORDER_PLACED" title="ORDER_PLACED">
          {filteredOrders.map(renderOrderItems)}
        </Tab>
        <Tab eventKey="SHIPPED" title="SHIPPED">
          {filteredOrders.map(renderOrderItems)}
        </Tab>
        <Tab eventKey="DELIVERED" title="DELIVERED">
          {filteredOrders.map(renderOrderItems)}
        </Tab>
        <Tab eventKey="CANCELLED" title="CANCELLED">
          {filteredOrders.map(renderOrderItems)}
        </Tab>
      </Tabs>

      {/* Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelOrder}>
            Sure
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default OrderTracking;
