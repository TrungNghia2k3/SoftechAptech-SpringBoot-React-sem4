package com.devteria.identityservice.controller;

import com.devteria.identityservice.constant.OrderStatus;
import com.devteria.identityservice.dto.request.CreateOrderRequest;
import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.OrderPaymentResponse;
import com.devteria.identityservice.dto.response.OrderResponse;
import com.devteria.identityservice.dto.response.OrderSummaryResponse;
import com.devteria.identityservice.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping("/create")
    ApiResponse<OrderPaymentResponse> createOrder(HttpServletRequest servletRequest, @RequestBody CreateOrderRequest request) {
        OrderPaymentResponse orderPaymentResponse = orderService.createOrder(servletRequest, request);
        return ApiResponse.<OrderPaymentResponse>builder().result(orderPaymentResponse).build();
    }

    @GetMapping("/getAll/{userId}")
    public ApiResponse<List<OrderResponse>> getAllOrdersByUserId(@PathVariable String userId) {
        return ApiResponse.<List<OrderResponse>>builder().result(orderService.findOrdersByUserId(userId)).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        return ApiResponse.<List<OrderResponse>>builder().result(orderService.getAllOrders()).build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getOrderSummary")
    public ApiResponse<OrderSummaryResponse> getOrderSummary() {
        return ApiResponse.<OrderSummaryResponse>builder().result(orderService.getOrderSummary()).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAllOrdersWithOrderPlacedStatus")
    public ApiResponse<List<OrderResponse>> getAllOrdersWithOrderPlacedStatus() {
        return ApiResponse.<List<OrderResponse>>builder().result(orderService.getAllOrdersWithOrderPlacedStatus()).build();
    }

    @GetMapping("/getById/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder().result(orderService.findOrderById(id)).build();
    }

    @PutMapping("/changeStatusCancel")
    public ApiResponse<OrderResponse> cancelOrder(@RequestParam String id) {
        return ApiResponse.<OrderResponse>builder().result(orderService.changeStatusOrder(id, OrderStatus.CANCELLED)).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changeStatusOrder")
    public ApiResponse<OrderResponse> updateOrderStatus(@RequestParam String id, @RequestParam String status) {
        return ApiResponse.<OrderResponse>builder().result(orderService.changeStatusOrder(id, status)).build();
    }
}
