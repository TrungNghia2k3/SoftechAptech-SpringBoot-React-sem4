package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.CouponRequest;
import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.CouponResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.dto.response.UserCouponsResponse;
import com.devteria.identityservice.service.CouponService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CouponController {
    CouponService couponService;

    @GetMapping("/pagination-sort")
    public ApiResponse<PageResponse<CouponResponse>> getAllPaginationSortCoupons(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        PageResponse<CouponResponse> coupons = couponService.getCoupons(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<CouponResponse>>builder().result(coupons).build();
    }

    @GetMapping
    ApiResponse<List<CouponResponse>> getAllCoupons() {
        return ApiResponse.<List<CouponResponse>>builder().result(couponService.getAllCoupons()).build();
    }

    @GetMapping("/{id}")
    ApiResponse<CouponResponse> getCoupon(@PathVariable String id) {
        return ApiResponse.<CouponResponse>builder().result(couponService.getCoupon(id)).build();
    }

    @PostMapping
    ApiResponse<CouponResponse> createCoupon(@RequestBody @Valid CouponRequest request) {
        return ApiResponse.<CouponResponse>builder().result(couponService.createCoupon(request)).build();
    }

    @PutMapping("/{id}")
    ApiResponse<CouponResponse> updateCoupon(@PathVariable String id, @RequestBody @Valid CouponRequest request) {
        return ApiResponse.<CouponResponse>builder().result(couponService.updateCoupon(id, request)).build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ApiResponse.<String>builder().result("Coupon deleted").build();
    }

    @PostMapping("/redeem-coupon")
    ApiResponse<UserCouponsResponse> redeemCoupon(@RequestParam String couponId, @RequestParam String userId) {
        return ApiResponse.<UserCouponsResponse>builder().result(couponService.redeemCoupon(couponId, userId)).build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<UserCouponsResponse>> getAllCouponsByUserId(@PathVariable String userId) {

        return ApiResponse.<List<UserCouponsResponse>>builder().result(couponService.getAllCouponsByUserId(userId)).build();
    }

    @PostMapping("/apply")
    public ApiResponse<Void> applyCoupons(@RequestParam String userId, @RequestBody List<String> couponIds) {
        couponService.applyCoupons(userId, couponIds);
        return ApiResponse.<Void>builder().message("Coupon applied").build();
    }
}
