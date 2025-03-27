import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import OrderDetailsModal from "../../../components/admin/order/OrderDetailsModal"; // Import OrderDetailsModal
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../../../services/orderService";
import {
  formatCurrencyVND,
  formatDateWithAmPm,
} from "../../../utilities/Utils";
import "./OrdersManagement.scss"; // Import file CSS

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrders(response.result);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleShowOrderDetails = async (orderId) => {
    try {
      const orderDetails = await getOrderById(orderId);
      setSelectedOrder(orderDetails.result);
      setNewStatus(orderDetails.result.orderStatus);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (selectedOrder) {
        await updateOrderStatus(selectedOrder.id, newStatus);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        toast.success("Updated status successfully");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "status-placed";
      case "SHIPPED":
        return "status-shipped";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <>
      <h1 className="fw-bold">Orders Management</h1>
      <div className="order-management-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Order Status</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="fw-bold">{order.id}</td>
                <td>{formatDateWithAmPm(order.orderDate)}</td>
                <td>{formatCurrencyVND(order.totalAmount)}</td>
                <td className={getOrderStatusClass(order.orderStatus)}>
                  {order.orderStatus}
                </td>
                <td>{order.userAddress.fullName}</td>
                <td>{order.userAddress.phone}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowOrderDetails(order.id)}
                  >
                    Show
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedOrder && (
          <OrderDetailsModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            selectedOrder={selectedOrder}
            newStatus={newStatus}
            handleStatusChange={handleStatusChange}
            handleSubmit={handleSubmit}
          />
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default OrdersManagement;
