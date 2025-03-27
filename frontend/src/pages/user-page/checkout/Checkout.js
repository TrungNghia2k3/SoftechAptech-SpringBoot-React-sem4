import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AddressModal from "../../../components/user/checkout/address-modal/AddressModal";
import AddressList from "../../../components/user/checkout/AddressList";
import CouponList from "../../../components/user/checkout/CouponList";
import OrderSummary from "../../../components/user/checkout/OrderSummary";
import PaymentMethod from "../../../components/user/checkout/PaymentMethod";
import ShippingMethod from "../../../components/user/checkout/ShippingMethod";
import { fetchCartByUserId } from "../../../features/cart/cartSlice";
import {
  applyCoupons,
  getAllCouponsByUserId,
} from "../../../services/couponService";
import { calculateFee, calculateLeadTime } from "../../../services/ghnService";
import { createOrder } from "../../../services/orderService";
import { getProductById } from "../../../services/productService";
import {
  createAddress,
  editAddress,
  getAddressList,
} from "../../../services/userAddressService";
import "./Checkout.scss";

const Checkout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const { products, totalAmount } = location.state || {
    products: [],
    totalAmount: 0,
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [leadTime, setLeadTime] = useState(null);
  const [fee, setFee] = useState(null);
  const [productTotal, setProductTotal] = useState(totalAmount);
  const [productDetails, setProductDetails] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState({
    amount: null,
    percentage: null,
    freeShip: false,
  });

  // Kiểm tra nếu products rỗng và totalAmount = 0, thì điều hướng về trang chủ
  useEffect(() => {
    if (products.length === 0 && totalAmount === 0) {
      navigate("/"); // Điều hướng về trang chủ
    }
  }, [products, totalAmount, navigate]);

  useEffect(() => {
    setProductTotal(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const details = await Promise.all(
          products.map((product) => getProductById(product.productId))
        );
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (products.length && !productDetails.length) {
      fetchProductDetails();
    }
  }, [products, productDetails.length]);

  const calculateShippingAndLeadTime = useCallback(async (address) => {
    try {
      const { districtCode, wardCode } = address;
      const wardCodeString = String(wardCode);
      const [leadTimeRes, feeRes] = await Promise.all([
        calculateLeadTime(districtCode, wardCodeString),
        calculateFee(districtCode, wardCodeString),
      ]);
      setLeadTime(leadTimeRes.data.data.leadtime);
      setFee(feeRes.data.data.total);
    } catch (error) {
      console.error("Error calculating shipping info:", error);
    }
  }, []);

  const openModal = useCallback((type, address = null) => {
    setModalType(type);
    setSelectedAddress(address);
    setShowModal(true);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const addressData = await getAddressList(user.id);

        if (addressData.result.length > 0) {
          calculateShippingAndLeadTime(addressData.result[0]);
          setSelectedAddress(addressData.result[0].id);
        } else {
          openModal("create");
          toast.info("Please enter your address information");
        }

        setAddresses(addressData.result);

        const couponData = await getAllCouponsByUserId(user.id);
        setCoupons(couponData.result);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [user.id, calculateShippingAndLeadTime, openModal]);

  // Hàm đóng modal với điều kiện addresses phải có phần tử
  const closeModal = useCallback(() => {
    // Kiểm tra nếu addresses không rỗng
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0].id); // Đặt lại địa chỉ đầu tiên sau khi đóng modal
      setShowModal(false); // Đóng modal
    } else {
      toast.info("Please enter your address information");
    }
  }, [addresses]);

  const handleSave = async (formData) => {
    try {
      // Lưu địa chỉ dựa trên loại modal (tạo mới hoặc chỉnh sửa)
      const response =
        modalType === "create"
          ? await createAddress(user.id, formData)
          : await editAddress(user.id, selectedAddress.id, formData);

      toast.success(
        `${modalType === "create" ? "Create" : "Edit"} address successfully`
      );

      // Lấy lại danh sách địa chỉ sau khi lưu
      const addressData = await getAddressList(user.id);
      const addressList = addressData.result;

      // Tìm và đặt địa chỉ mặc định mới sau khi lưu
      const defaultAddress = addressList.find((address) => address.default);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else {
        setSelectedAddress(response.result.id);
      }

      // Cập nhật danh sách địa chỉ
      setAddresses(addressList);
      
      setShowModal(false); // Đóng modal
    } catch (error) {
      if (error.response?.data?.code === 1036) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.code === 1001) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((key) =>
          toast.error(`${key} ${validationErrors[key]}`)
        );
      } else {
        toast.error("Add address failed. Please try again.");
      }
    }
  };

  const handleAddressSelect = useCallback(
    (address) => {
      setSelectedAddress(address.id);
      calculateShippingAndLeadTime(address);
    },
    [calculateShippingAndLeadTime]
  );

  const handleOrderConfirmation = async () => {
    try {
      let finalAmount = productTotal;
      const couponIds = [];
      let discountAmount = 0; // Khởi tạo discountAmount

      // Áp dụng giảm giá theo loại coupon đã chọn
      if (selectedCoupons.amount) {
        discountAmount += selectedCoupons.amount.value; // Cộng giá trị giảm giá vào discountAmount
        finalAmount -= selectedCoupons.amount.value;
        couponIds.push(selectedCoupons.amount.id); // Thêm ID của coupon amount vào mảng couponIds
      }
      if (selectedCoupons.percentage) {
        const percentageDiscount =
          (finalAmount * selectedCoupons.percentage.value) / 100;
        discountAmount += percentageDiscount; // Cộng giá trị giảm giá theo phần trăm vào discountAmount
        finalAmount -= percentageDiscount;
        couponIds.push(selectedCoupons.percentage.id); // Thêm ID của coupon percentage vào mảng couponIds
      }
      if (selectedCoupons.freeShip) {
        couponIds.push("FREESHIP"); // Thêm ID của coupon freeShip vào mảng couponIds nếu có
      }

      // Dữ liệu đơn hàng
      const orderData = {
        selectedProducts: products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
        amount: finalAmount,
        discountAmount: discountAmount, // Thêm discountAmount vào orderData
        shippingFee: selectedCoupons.freeShip ? 0 : fee,
        leadTime: leadTime,
        userId: user.id,
        userAddressId: selectedAddress,
        paymentMethod: selectedPaymentMethod,
      };

      // Gọi API áp dụng coupon trước khi tạo đơn hàng
      if (couponIds.length > 0) {
        await applyCoupons(user.id, couponIds);
      }

      // Gọi API tạo đơn hàng
      const response = await createOrder(orderData);

      // Cập nhật lại giỏ hàng sau khi tạo đơn hàng thành công
      dispatch(fetchCartByUserId(user.id));

      // Xử lý điều hướng dựa trên phương thức thanh toán
      if (orderData.paymentMethod === "COD") {
        window.location.href = "/success-payment";
      } else if (orderData.paymentMethod === "VNPAY") {
        window.location.href =
          response.result.paymentResponse.vnPayResponse.paymentUrl;
      }
    } catch (error) {
      toast.error("Please enter complete information before payment");
    }
  };

  const handleCouponChange = (couponType, coupon) => {
    setSelectedCoupons((prev) => {
      // Clone the previous coupons state
      let newCoupons = { ...prev };

      if (couponType === "AMOUNT") {
        // If the same coupon is already selected, unselect it
        if (newCoupons.amount === coupon) {
          newCoupons.amount = null;
        } else {
          // Ensure only one AMOUNT coupon is selected
          newCoupons.amount = coupon;
          // Unselect PERCENTAGE if previously selected
          newCoupons.percentage = null;
        }
      } else if (couponType === "PERCENTAGE") {
        // If the same coupon is already selected, unselect it
        if (newCoupons.percentage === coupon) {
          newCoupons.percentage = null;
        } else {
          // Ensure only one PERCENTAGE coupon is selected
          newCoupons.percentage = coupon;
          // Unselect AMOUNT if previously selected
          newCoupons.amount = null;
        }
      } else if (couponType === "FREESHIP") {
        // Toggle FREESHIP selection
        if (newCoupons.freeShip === coupon) {
          newCoupons.freeShip = null;
        } else {
          // Ensure only one FREESHIP coupon is selected
          newCoupons.freeShip = coupon;
        }
      }

      // Ensure that no more than 2 coupons are selected
      const selectedCount = [
        newCoupons.amount,
        newCoupons.percentage,
        newCoupons.freeShip,
      ].filter(Boolean).length;
      if (selectedCount > 2) {
        // Remove excess coupon selections if more than 2 are selected
        if (newCoupons.amount && couponType !== "AMOUNT") {
          newCoupons.amount = null;
        }
        if (newCoupons.percentage && couponType !== "PERCENTAGE") {
          newCoupons.percentage = null;
        }
        if (newCoupons.freeShip && couponType !== "FREESHIP") {
          newCoupons.freeShip = null;
        }
      }

      return newCoupons;
    });
  };

  // Lọc để chỉ giữ lại những coupon có giá trị minOrderValue nhỏ hơn hoặc bằng amount.
  const filterCouponsByAmount = (coupons, amount) => {
    return coupons.filter((coupon) => coupon.coupon.minOrderValue <= amount);
  };

  const filteredCoupons = filterCouponsByAmount(coupons, productTotal);

  return (
    <Container>
      <h3>Checkout</h3>

      <AddressList
        addresses={addresses}
        selectedAddress={selectedAddress}
        onAddressSelect={handleAddressSelect}
        onEditAddress={(address) => openModal("edit", address)}
        onAddNewAddress={() => openModal("create")}
      />

      <ShippingMethod leadTime={leadTime} fee={fee} />

      <PaymentMethod
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={(e) => {
          if (e && e.target && e.target.value) {
            setSelectedPaymentMethod(e.target.value);
          }
        }}
        totalPayment={
          productTotal -
          (selectedCoupons.amount?.value || 0) -
          (selectedCoupons.percentage
            ? (productTotal * selectedCoupons.percentage.value) / 100
            : 0) +
          (selectedCoupons.freeShip ? 0 : fee)
        }
      />

      {filteredCoupons.length > 0 && (
        <CouponList
          coupons={filteredCoupons}
          onCouponChange={handleCouponChange}
          selectedCoupons={selectedCoupons}
        />
      )}

      <OrderSummary
        productDetails={productDetails}
        products={products}
        productTotal={
          productTotal -
          (selectedCoupons.amount?.value || 0) -
          (selectedCoupons.percentage
            ? (productTotal * selectedCoupons.percentage.value) / 100
            : 0)
        }
        fee={selectedCoupons.freeShip ? 0 : fee}
        totalPayment={
          productTotal -
          (selectedCoupons.amount?.value || 0) -
          (selectedCoupons.percentage
            ? (productTotal * selectedCoupons.percentage.value) / 100
            : 0) +
          (selectedCoupons.freeShip ? 0 : fee)
        }
        onOrderConfirmation={handleOrderConfirmation}
      />

      {showModal && (
        <AddressModal
          show={showModal}
          handleClose={closeModal}
          handleSave={handleSave}
          selectedAddress={selectedAddress}
          modalType={modalType}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default Checkout;
