import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Grid } from "react-bootstrap-icons";
import { formatCurrencyVND, formatDateWithAmPm } from "../../../utilities/Utils";
import OrderDetailsModal from "../order/OrderDetailsModal";
import { updateOrderStatus } from "../../../services/orderService";
import { toast } from "react-toastify";

const OrdersTable = React.memo(({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const handleShowOrderDetails = async (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setShowModal(true);
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
      <div className="order-management-table">
        <div className="p-2">
          <h5>
            <Grid className="me-2" />
            RECENT ORDERS
          </h5>
          <hr />
        </div>
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
                    onClick={() => handleShowOrderDetails(order)}
                  >
                    Show
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

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
    </>
  );
});

export default OrdersTable;
