package com.ntn.ecommerce.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.request.AdminResponseRequest;
import com.ntn.ecommerce.dto.request.CommentRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.CommentResponse;
import com.ntn.ecommerce.dto.response.PageResponse;
import com.ntn.ecommerce.service.CommentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentController {
    CommentService commentService;

    @GetMapping("/getAllCommentAndRatingByProductId/{productId}")
    ApiResponse<List<CommentResponse>> getAllCommentAndRatingByProductId(@PathVariable String productId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getAllCommentAndRatingByProductId(productId))
                .build();
    }

    @GetMapping("/getById/{id}")
    ApiResponse<CommentResponse> getCommentById(@PathVariable Long id) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.getById(id))
                .build();
    }

    @GetMapping("/getAllComments")
    ApiResponse<PageResponse<CommentResponse>> getAllComments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getAllComments(page, size, sortBy, sortDirection))
                .build();
    }

    @PostMapping("/create")
    ApiResponse<CommentResponse> createCommentAndRating(
            @RequestParam String userId, @RequestParam String productId, @RequestBody @Valid CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.addCommentAndRating(userId, productId, request))
                .build();
    }

    @GetMapping("/check")
    ApiResponse<Boolean> checkUserPurchasedProduct(@RequestParam String productId, @RequestParam String userId) {
        return ApiResponse.<Boolean>builder()
                .result(commentService.checkUserPurchasedProduct(userId, productId))
                .build();
    }

    @PutMapping("/update/{id}")
    ApiResponse<CommentResponse> updateCommentAndRating(
            @PathVariable Long id, @RequestBody @Valid CommentRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.editCommentAndRating(id, request))
                .build();
    }

    @DeleteMapping("/remove/{id}")
    ApiResponse<Void> deleteCommentAndRating(@PathVariable Long id) {
        commentService.removeCommentAndRating(id);
        return ApiResponse.<Void>builder().message("Comment deleted").build();
    }

    // API để admin thêm phản hồi cho comment
    @PostMapping("/admin-response/{id}")
    public ApiResponse<CommentResponse> addAdminResponse(
            @PathVariable Long id, @RequestBody @Valid AdminResponseRequest request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.addAdminResponse(id, request))
                .build();
    }
}
