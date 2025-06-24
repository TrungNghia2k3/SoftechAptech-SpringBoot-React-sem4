package com.ntn.ecommerce.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ntn.ecommerce.configuration.VNPAYConfig;
import com.ntn.ecommerce.constant.CartStatus;
import com.ntn.ecommerce.constant.OrderStatus;
import com.ntn.ecommerce.constant.PaymentMethod;
import com.ntn.ecommerce.dto.request.CartProductRequest;
import com.ntn.ecommerce.dto.request.CreateOrderRequest;
import com.ntn.ecommerce.dto.response.*;
import com.ntn.ecommerce.entity.*;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.mapper.OrderMapper;
import com.ntn.ecommerce.repository.*;
import com.ntn.ecommerce.utilities.VNPayUtilities;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    UserRepository userRepository;
    CartRepository cartRepository;
    CartProductRepository cartProductRepository;
    OrderRepository orderRepository;
    PaymentRepository paymentRepository;
    ProductRepository productRepository;
    UserAddressRepository userAddressRepository;
    NotificationRepository notificationRepository;
    OrderMapper orderMapper;
    VNPAYConfig vnPayConfig;

    @NonFinal
    @Value("${payment.vnPay.secretKey}")
    protected String secretKey;

    public OrderPaymentResponse createOrder(HttpServletRequest servletRequestRequest, CreateOrderRequest request) {
        String userId = request.getUserId();
        List<CartProductRequest> selectedProducts = request.getSelectedProducts();
        Long amount = request.getAmount();
        Long discountAmount = request.getDiscountAmount();
        Long shippingFee = request.getShippingFee();
        Long leadTime = request.getLeadTime();
        Long userAddressId = request.getUserAddressId();
        String paymentMethod = request.getPaymentMethod();

        // Kiểm tra giỏ hàng nhờ user id và có trạng thái là active
        Cart activeCart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE);

        // Lấy ra tất cả các sản phẩm trong giỏ hàng
        List<CartProduct> cartProducts = cartProductRepository.findByCartId(activeCart.getId());

        // So sánh danh sách sản phẩm được chọn với tất cả sản phẩm có trong giỏ hàng hiện tại
        boolean allProductsMatch = cartProducts.stream().allMatch(cp -> selectedProducts.stream()
                .anyMatch(sp -> sp.getProductId().equals(cp.getProduct().getId())));

        if (allProductsMatch) {
            // Trường hợp 1: tất cả sản phẩm trong giỏ hàng đều khớp với sản phẩm được chọn
            completeCart(activeCart);
        } else {
            // Trường hợp 2: không phải tất cả các sản phẩm trong giỏ hàng đều khớp với sản phẩm được chọn
            Cart newCart = createNewCart(userId);
            moveUnselectedProductsToNewCart(selectedProducts, cartProducts, activeCart, newCart);
            completeCart(activeCart);
        }

        // Tạo và lưu đơn hàng
        Order order = new Order();
        order.setId(VNPayUtilities.getRandomNumber(8));
        order.setAmount(amount);
        order.setDiscountAmount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setChangedAt(LocalDateTime.now());
        order.setOrderDate(LocalDateTime.now());
        order.setLeadTime(leadTime);
        order.setOrderStatus(OrderStatus.ORDER_PLACED);
        order.setTotalAmount(amount + shippingFee);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserAddress userAddress = userAddressRepository
                .findById(userAddressId)
                .orElseThrow(() -> new RuntimeException("User address not found"));

        order.setUser(user);
        order.setUserAddress(userAddress);
        order.setCart(activeCart);
        orderRepository.save(order);

        // Xử lý tạo thông báo
        createNotification(order, user, "order placed");

        // Xử lý thanh toán
        PaymentResponse paymentResponse = handlePayment(servletRequestRequest, paymentMethod, order);

        // Create and return the OrderPaymentResponse
        return new OrderPaymentResponse(order, paymentResponse);
    }

    public List<OrderResponse> findOrdersByUserId(String userId) {
        // Fetch orders from repository
        List<Order> orders = orderRepository.findByUserId(userId);

        // Convert to DTOs
        return orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate).reversed())
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        // Sort the orders by orderDate in descending order (most recent first)
        return orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate).reversed())
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderSummaryResponse getOrderSummary() {
        List<Order> orders = orderRepository.findAll();

        // Calculate the total number of orders
        Long totalOrders = (long) orders.size();

        // Calculate the total sale (sum of totalAmount of all orders with status DELIVERED)
        Long totalSale = orders.stream()
                .filter(order -> OrderStatus.DELIVERED.equals(order.getOrderStatus())) // Filter only DELIVERED orders
                .mapToLong(Order::getTotalAmount)
                .sum();

        // Return the response with totalOrders and totalSale
        return new OrderSummaryResponse(totalOrders, totalSale);
    }

    public List<OrderResponse> getAllOrdersWithOrderPlacedStatus() {
        List<Order> orders = orderRepository.findByOrderStatus(OrderStatus.ORDER_PLACED);

        // Sort the orders by orderDate in descending order (most recent first)
        return orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate).reversed())
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse findOrderById(String id) {
        // Fetch the Order entity
        Optional<Order> optionalOrder = orderRepository.findById(id);

        // Handle the case where the order might not be found
        if (optionalOrder.isEmpty()) {
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }

        Order order = optionalOrder.get();

        // Convert to DTO
        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse changeStatusOrder(String id, String orderStatus) {
        // Find the order by ID
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            // Get the order from Optional
            Order order = optionalOrder.get();

            // Update the order status
            order.setOrderStatus(orderStatus);

            // Check if the status is SHIPPED
            if (OrderStatus.SHIPPED.equals(orderStatus)) {
                // Loop through the cart products and update product stock and sold items
                for (CartProduct cartProduct : order.getCart().getCartProducts()) {
                    Product product = cartProduct.getProduct();
                    Integer quantity = cartProduct.getQuantity();

                    // Update inStock and SoldItems
                    product.setInStock(product.getInStock() - quantity);
                    product.setSoldItems(product.getSoldItems() + quantity);

                    // Save the updated product to the database
                    productRepository.save(product);
                }
            }

            if (OrderStatus.DELIVERED.equals(orderStatus)) {
                // Check if order.getDiscountAmount() is null and initialize it to 0 if necessary
                if (order.getDiscountAmount() == null) {
                    order.setDiscountAmount(0L);
                }

                // Update points for User
                Long newPoints = (order.getAmount() + order.getDiscountAmount()) / 1000;
                User user = order.getUser();

                // Check if user.getPoints() is null and initialize it to 0 if necessary
                if (user.getPoints() == null) {
                    user.setPoints(0L);
                }

                // Add the new points to the existing points
                user.setPoints(user.getPoints() + newPoints);

                // Save the updated user to the database
                userRepository.save(user);
            }

            // Save the updated order to the database
            Order updatedOrder = orderRepository.save(order);

            // Xử lý tạo thông báo
            String content = orderStatus.toLowerCase();
            createNotification(order, order.getUser(), content);

            // Convert to DTO and return
            return orderMapper.toOrderResponse(updatedOrder);
        } else {
            // Handle case where the order is not found
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }
    }

    private void completeCart(Cart cart) {
        cart.setStatus(CartStatus.COMPLETED);
        cartRepository.save(cart);
    }

    private Cart createNewCart(String userId) {
        Cart newCart = new Cart();
        newCart.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        newCart.setCreatedDate(new Date());
        newCart.setStatus(CartStatus.ACTIVE);
        return cartRepository.save(newCart);
    }

    private void moveUnselectedProductsToNewCart(
            List<CartProductRequest> selectedProducts, List<CartProduct> cartProducts, Cart oldCart, Cart newCart) {
        // Lặp lại tất cả các sản phẩm trong giỏ hàng cũ
        for (CartProduct cartProduct : cartProducts) {
            // Kiểm tra xem sản phẩm có nằm trong danh sách các sản phẩm đã chọn không
            boolean isSelected = selectedProducts.stream().anyMatch(sp -> sp.getProductId()
                    .equals(cartProduct.getProduct().getId()));

            if (!isSelected) {
                // Thêm sản phẩm vào giỏ hàng mới
                cartProduct.setCart(newCart);
                cartProductRepository.save(cartProduct);

                // Xóa sản phẩm khỏi giỏ hàng cũ
                if (cartProduct.getCart().equals(oldCart)) {
                    cartProductRepository.delete(cartProduct);
                }
            }
        }
    }

    private PaymentResponse handlePayment(HttpServletRequest request, String paymentMethod, Order order) {
        Payment payment = new Payment();
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setOrder(order);

        VNPayResponse vnPayResponse = null;

        if (PaymentMethod.COD.equalsIgnoreCase(paymentMethod)) {
            payment.setPaymentMethod(PaymentMethod.COD);
        } else if (PaymentMethod.VNPAY.equalsIgnoreCase(paymentMethod)) {
            // Process VNPAY payment
            payment.setPaymentMethod(PaymentMethod.VNPAY);
            vnPayResponse = createVnPayPayment(request, order.getTotalAmount(), order.getId());
        }

        paymentRepository.save(payment);

        // Return a response containing both Payment and VNPayResponse
        return new PaymentResponse(payment, vnPayResponse);
    }

    private VNPayResponse createVnPayPayment(HttpServletRequest request, Long amount, String orderId) {

        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();

        long vnpAmount = amount * 100L;

        // Chuyển đổi số tiền đã được nhân thành chuỗi và đặt vào tham số `vnp_Amount`
        vnpParamsMap.put("vnp_Amount", String.valueOf(vnpAmount));
        vnpParamsMap.put("vnp_OrderInfo", "Order payment:" + orderId);
        vnpParamsMap.put("vnp_BankCode", "NCB");
        vnpParamsMap.put("vnp_IpAddr", VNPayUtilities.getIpAddress(request));

        // build query url

        String queryUrl = VNPayUtilities.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtilities.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtilities.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return VNPayResponse.builder().paymentUrl(paymentUrl).build();
    }

    private void createNotification(Order order, User user, String status) {
        // Xử lý tạo thông báo
        Notification notification = new Notification();
        notification.setOrder(order); // Đặt liên kết với đơn hàng
        notification.setUser(user); // Đặt liên kết với người dùng
        notification.setContent("Order " + order.getId() + " has been " + status
                + ". See you again in your next orders."); // Nội dung thông báo
        notification.setTimestamp(LocalDateTime.now()); // Thời gian thực
        notification.setRead(false);

        // Lưu thông báo vào cơ sở dữ liệu (triển khai phương thức lưu thông báo tương ứng)
        notificationRepository.save(notification);
    }
}
