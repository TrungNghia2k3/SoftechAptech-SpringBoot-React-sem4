package com.ntn.ecommerce.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.request.PublisherRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.PageResponse;
import com.ntn.ecommerce.dto.response.PublisherResponse;
import com.ntn.ecommerce.service.PublisherService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/publishers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherController {
    PublisherService publisherService;

    @GetMapping
    public ApiResponse<List<PublisherResponse>> getAllPublishers() {
        return ApiResponse.<List<PublisherResponse>>builder()
                .result(publisherService.getAll())
                .build();
    }

    @GetMapping("/pagination-sort")
    public ApiResponse<PageResponse<PublisherResponse>> getAllPaginationAndSortPublishers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        PageResponse<PublisherResponse> publishers =
                publisherService.getAllPublishers(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<PublisherResponse>>builder()
                .result(publishers)
                .build();
    }

    @PostMapping("/add")
    public ApiResponse<PublisherResponse> createPublisher(@RequestBody @Valid PublisherRequest request) {

        return ApiResponse.<PublisherResponse>builder()
                .result(publisherService.createPublisher(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PublisherResponse> updatePublisher(
            @PathVariable Long id, @RequestBody @Valid PublisherRequest request) {
        return ApiResponse.<PublisherResponse>builder()
                .result(publisherService.updatePublisher(id, request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PublisherResponse> getPublisherById(@PathVariable Long id) {
        return ApiResponse.<PublisherResponse>builder()
                .result(publisherService.getPublisherById(id))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePublisher(@PathVariable Long id) {
        publisherService.deletePublisher(id);
        return ApiResponse.<Void>builder().message("Publisher deleted").build();
    }

    @PatchMapping("/{id}/toggle-disable")
    public ApiResponse<PublisherResponse> toggleDisabledPublisher(@PathVariable Long id) {
        return ApiResponse.<PublisherResponse>builder()
                .result(publisherService.toggleDisabledPublisher(id))
                .build();
    }
}
