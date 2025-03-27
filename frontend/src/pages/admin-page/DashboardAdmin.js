import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
  CalculatorFill,
  Grid,
  Receipt,
  StarFill,
  Truck,
} from "react-bootstrap-icons";
import {
  BsBox,
  BsBuilding,
  BsChatDots,
  BsClipboardData,
  BsPeople,
  BsTags,
} from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import DashboardCard from "../../components/admin/dashboard/DashboardCard";
import OrderDetailsModal from "../../components/admin/order/OrderDetailsModal";
import { getAllCategories } from "../../services/categoryService";
import { getAllCoupons } from "../../services/couponService";
import { getAllFeedbacks } from "../../services/feedbackService";
import { getAllManufactures } from "../../services/manufacturesService";
import {
  getAllOrdersWithOrderPlacedStatus,
  getOrderById,
  getOrderSummary,
  updateOrderStatus,
} from "../../services/orderService";
import {
  getAllProducts,
  rankingMostPopularProducts,
} from "../../services/productService";
import { getAllPublishers } from "../../services/publisherService";
import { getAllPaginationSorUsers } from "../../services/userService";
import { formatCurrencyVND, formatDateWithAmPm } from "../../utilities/Utils";

const DashboardAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    numberUsers: "",
    numberProducts: "",
    numberCategories: "",
    numberPublishers: "",
    numberOrders: "",
    numberFeedbacks: "",
    numberManufactures: "",
    numberCoupons: "",
    totalSale: "",
  });

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        usersResponse,
        productsResponse,
        categoriesResponse,
        publishersResponse,
        ordersResponse,
        feedbacksResponse,
        manufacturesResponse,
        couponsResponse,
        rankingProductsResponse,
        placedOrdersResponse,
      ] = await Promise.all([
        getAllPaginationSorUsers(),
        getAllProducts(),
        getAllCategories(),
        getAllPublishers(),
        getOrderSummary(),
        getAllFeedbacks(),
        getAllManufactures(),
        getAllCoupons(),
        rankingMostPopularProducts(),
        getAllOrdersWithOrderPlacedStatus(),
      ]);

      setDashboardData({
        numberUsers: usersResponse.totalElements,
        numberProducts: productsResponse.totalElements,
        numberCategories: categoriesResponse.result.length,
        numberPublishers: publishersResponse.result.length,
        numberOrders: ordersResponse.result.totalOrders,
        numberFeedbacks: feedbacksResponse.result.length,
        numberManufactures: manufacturesResponse.result.length,
        numberCoupons: couponsResponse.result.length,
        totalSale: ordersResponse.result.totalSale,
      });

      setOrders(placedOrdersResponse.result);
      setProducts(rankingProductsResponse.result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const {
    numberUsers,
    numberProducts,
    numberCategories,
    numberPublishers,
    numberOrders,
    numberFeedbacks,
    numberManufactures,
    numberCoupons,
    totalSale,
  } = dashboardData;

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
      <Row>
        <DashboardCard
          title="Users"
          value={numberUsers}
          icon={<BsPeople />}
          link="/admin/users"
        />
        <DashboardCard
          title="Products"
          value={numberProducts}
          icon={<BsBox />}
          link="/admin/products"
        />
        <DashboardCard
          title="Categories"
          value={numberCategories}
          icon={<BsTags />}
          link="/admin/categories"
        />
      </Row>

      <Row>
        <DashboardCard
          title="Publishers"
          value={numberPublishers}
          icon={<BsBuilding />}
          link="/admin/publishers"
        />
        <DashboardCard
          title="Orders"
          value={numberOrders}
          icon={<BsClipboardData />}
          link="/admin/orders"
        />
        <DashboardCard
          title="Feedbacks"
          value={numberFeedbacks}
          icon={<BsChatDots />}
          link="/admin/feedbacks"
        />
      </Row>

      <Row>
        <DashboardCard
          title="Manufactures"
          value={numberManufactures}
          icon={<Truck />}
          link="/admin/manufactures"
        />
        <DashboardCard
          title="Coupons"
          value={numberCoupons}
          icon={<Receipt />}
          link="/admin/coupons"
        />
        <DashboardCard
          title="Total Sale"
          value={formatCurrencyVND(totalSale)}
          icon={<CalculatorFill />}
          link="/admin/orders"
        />
      </Row>

      <Row className="mt-3">
        <Col lg={6} className="bg-white">
          <div className="order-management-table">
            <div className="p-2 ">
              <h5>
                <Grid className="me-2 mb-1" />
                RECENT ORDERS
              </h5>
              <hr />
            </div>
            <Table striped bordered hover responsive>
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
          </div>
        </Col>

        <Col lg={6} className="bg-white">
          <div className="ranking-most-popular-products-table">
            <div className="p-2">
              <h5>
                <StarFill className="me-2 mb-1" />
                RANKING OF THE MOST POPULAR PRODUCTS
              </h5>
              <hr />
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Title</th>
                  <th>Sold Items</th>
                  <th>Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product.id}>
                    <td className="fw-bold">{product.product.id}</td>
                    <td>{product.product.title}</td>
                    <td>{product.product.soldItems}</td>
                    <td>{product.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </Row>
    </>
  );
};

export default DashboardAdmin;
