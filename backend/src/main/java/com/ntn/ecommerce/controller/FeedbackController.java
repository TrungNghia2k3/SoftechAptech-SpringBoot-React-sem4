package com.ntn.ecommerce.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.request.FeedbackRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.FeedbackResponse;
import com.ntn.ecommerce.dto.response.PageResponse;
import com.ntn.ecommerce.service.FeedbackService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FeedbackController {
    FeedbackService feedbackService;

    @PostMapping("/create")
    ApiResponse<FeedbackResponse> createFeedback(@RequestBody @Valid FeedbackRequest request) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedbackService.createFeedback(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<FeedbackResponse>> getAllFeedbacks() {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedbackService.getAll())
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deteleFeedback(id);
        return ApiResponse.<Void>builder().message("Feedback deleted").build();
    }

    @GetMapping("/pagination-sort")
    public ApiResponse<PageResponse<FeedbackResponse>> getAllPaginationSortFeedbacks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        PageResponse<FeedbackResponse> feedbacks = feedbackService.getFeedbacks(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<FeedbackResponse>>builder()
                .result(feedbacks)
                .build();
    }
}
