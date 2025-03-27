import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import UserLayout from "../components/user/UserLayout";
import CounterFeature from "../features/counter/CounterFeature";
import AddEditProduct from "../pages/admin-page/AddEditProduct";
import CategoriesManagement from "../pages/admin-page/CategoriesManagement";
import CouponsManagement from "../pages/admin-page/CouponsManagement";
import DashboardAdmin from "../pages/admin-page/DashboardAdmin";
import FeedbacksManagement from "../pages/admin-page/FeedbacksManagement";
import InventoryManagement from "../pages/admin-page/InventoryManagement";
import ManufactureManagement from "../pages/admin-page/ManufactureManagement";
import OrdersManagement from "../pages/admin-page/order/OrdersManagement";
import ProductsManagement from "../pages/admin-page/ProductsManagement";
import PublishersManagement from "../pages/admin-page/PublishersManagement";
import UsersManagement from "../pages/admin-page/UsersManagement";
import MyForm from "../pages/form-validation/MyForm";
import ValidationForm from "../pages/form-validation/ValidationForm";
import VerifyUsername from "../pages/public-page//verify/VerifyUsername";
import About from "../pages/public-page/About";
import Authenticate from "../pages/public-page/Authenticate";
import FAQs from "../pages/public-page/FAQs";
import Feedback from "../pages/public-page/feedback/Feedback";
import ForgotPassword from "../pages/public-page/forgot-password/ForgotPassword";
import Home from "../pages/public-page/Home";
import Login from "../pages/public-page/login/Login";
import ProductDetail from "../pages/public-page/product-detail/ProductDetail";
import ProductList from "../pages/public-page/ProductList";
import Register from "../pages/public-page/register/Register";
import VerifyUser from "../pages/public-page/verify/VerifyUser";
import Addresses from "../pages/user-page/Addresses";
import Cart from "../pages/user-page/Cart";
import ChangePassword from "../pages/user-page/ChangePassword";
import Checkout from "../pages/user-page/checkout/Checkout";
import Notification from "../pages/user-page/Notification";
import OrderDetail from "../pages/user-page/order-detail/OrderDetail";
import OrderTracking from "../pages/user-page/OrderTracking";
import PaymentCallback from "../pages/user-page/PaymentCallback";
import Profile from "../pages/user-page/Profile";
import ReedeemPoint from "../pages/user-page/ReedeemPoint";
import SuccessPayment from "../pages/user-page/SuccessPayment";
import WalletCoupon from "../pages/user-page/WalletCoupon";
import Wishlist from "../pages/user-page/Wishlist";
import ProtectedRoute from "./ProtectedRoute";
import CommentsManagement from "../pages/admin-page/CommentsManagement";

const AppRoutes = ({ isLoggedIn, userRoles }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/counter-feature" element={<CounterFeature />} />
      <Route path="/my-form" element={<MyForm />} />
      <Route path="/validation-form" element={<ValidationForm />} />
      <Route path="/product-list" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Unauthorized Routes (only accessible if not logged in) */}
      {!isLoggedIn && (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-user" element={<VerifyUser />} />
          <Route path="/verify-username" element={<VerifyUsername />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/authenticate?error=access_denied" element={<Login />} />
        </>
      )}

      {/* Protected Routes (accessible only when logged in) */}
      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        {/* Redirect Unauthorized Routes */}
        {isLoggedIn && (
          <>
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/verify-user" element={<Navigate to="/" />} />
            <Route path="/verify-username" element={<Navigate to="/" />} />
            <Route path="/forgot-password" element={<Navigate to="/" />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/authenticate" element={<Navigate to="/" />} />
            <Route
              path="/authenticate?error=access_denied"
              element={<Navigate to="/" />}
            />
          </>
        )}

        {/* Admin Routes */}
        {userRoles === "ADMIN" && (
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<DashboardAdmin />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="categories" element={<CategoriesManagement />} />
                  <Route path="publishers" element={<PublishersManagement />} />
                  <Route path="orders" element={<OrdersManagement />} />
                  <Route path="feedbacks" element={<FeedbacksManagement />} />
                  <Route path="comments" element={<CommentsManagement />} />
                  <Route path="products/add" element={<AddEditProduct />} />
                  <Route
                    path="products/edit/:id"
                    element={<AddEditProduct />}
                  />

                  {/* New route */}

                  <Route
                    path="manufactures"
                    element={<ManufactureManagement />}
                  />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="coupons" element={<CouponsManagement />} />
                </Routes>
              </AdminLayout>
            }
          />
        )}

        {/* User Routes */}
        {userRoles === "USER" && (
          <>
            <Route
              path="/user/*"
              element={
                <UserLayout>
                  <Routes>
                    <Route path="profile" element={<Profile />} />
                    <Route path="order-tracking" element={<OrderTracking />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="notification" element={<Notification />} />
                    {/* <Route path="dashboard" element={<UserDashboard />} /> */}
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="redeem-point" element={<ReedeemPoint />} />
                    <Route path="wallet-coupon" element={<WalletCoupon />} />

                    {/* New route */}
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route
                      path="/change-password"
                      element={<ChangePassword />}
                    />
                  </Routes>
                </UserLayout>
              }
            />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-callback" element={<PaymentCallback />} />
            <Route path="success-payment" element={<SuccessPayment />} />
          </>
        )}
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
