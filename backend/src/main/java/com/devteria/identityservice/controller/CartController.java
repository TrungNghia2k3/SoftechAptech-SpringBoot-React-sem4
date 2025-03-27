package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.AddToCartRequest;
import com.devteria.identityservice.dto.request.CartProductRequest;
import com.devteria.identityservice.dto.request.RemoveProductFromCartRequest;
import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.CartResponse;
import com.devteria.identityservice.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @PostMapping("/add/{userId}")
    public ApiResponse<CartResponse> addToCart(@PathVariable String userId, @RequestBody AddToCartRequest request) {
        CartResponse result = cartService.addToCart(userId, request.getProductId(), request.getQuantity());
        return ApiResponse.<CartResponse>builder().result(result).build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<CartResponse> getCartByUserId(@PathVariable String userId) {
        CartResponse result = cartService.getCartByUserId(userId);
        return ApiResponse.<CartResponse>builder().result(result).build();
    }

    @PutMapping("/edit/{userId}")
    ApiResponse<CartResponse> editCartProductQuantities(@PathVariable String userId, @RequestBody List<CartProductRequest> products) {

        CartResponse result = cartService.editCartProductQuantities(userId, products);
        return ApiResponse.<CartResponse>builder().result(result).build();
    }

    @DeleteMapping("/remove/{userId}")
    ApiResponse<CartResponse> removeProductFromCart(@PathVariable String userId, @RequestBody RemoveProductFromCartRequest request) {
        CartResponse result = cartService.removeProductFromCart(userId, request.getProductId());
        return ApiResponse.<CartResponse>builder().result(result).build();
    }
}
