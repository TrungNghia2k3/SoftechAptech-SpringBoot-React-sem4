package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.WishlistResponse;
import com.devteria.identityservice.service.WishlistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishlistController {
    WishlistService wishlistService;

    // Lấy danh sách wishlist của người dùng
    @GetMapping("/user/{userId}")
    public ApiResponse<WishlistResponse> getWishlistByUserId(@PathVariable String userId) {

        return ApiResponse.<WishlistResponse>builder()
                .result(wishlistService.getWishlistByUserId(userId))
                .build();
    }

    // Thêm sản phẩm vào wishlist
    @PostMapping("/add")
    public ApiResponse<Void> addProductToWishlist(@RequestParam String userId, @RequestParam String productId) {
        wishlistService.addProductToWishlist(userId, productId);
        return ApiResponse.<Void>builder()
                .message("Added product to wishlist")
                .build();
    }

    // Xóa sản phẩm khỏi wishlist
    @DeleteMapping("/remove")
    public ApiResponse<Void> removeProductFromWishlist(@RequestParam String userId, @RequestParam String productId) {
        wishlistService.removeProductFromWishlist(userId, productId);
        return ApiResponse.<Void>builder()
                .message("Removed product from wishlist")
                .build();
    }

    // Kiểm tra sản phẩm có trong wishlist không
    @GetMapping("/check")
    public ApiResponse<Boolean> checkIfInWishlist(@RequestParam String userId, @RequestParam String productId) {

        return ApiResponse.<Boolean>builder()
                .result(wishlistService.checkIfInWishlist(userId, productId))
                .build();
    }
}
