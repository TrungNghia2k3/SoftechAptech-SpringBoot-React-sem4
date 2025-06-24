package com.ntn.ecommerce.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ntn.ecommerce.dto.request.CategoryRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.CategoryResponse;
import com.ntn.ecommerce.dto.response.PageResponse;
import com.ntn.ecommerce.exception.MissingImageException;
import com.ntn.ecommerce.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryController {
    CategoryService categoryService;
    Validator validator;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CategoryResponse> createCategory(
            @RequestPart("request") String requestJson, @RequestPart("image") MultipartFile image) throws IOException {

        // Check if image is present
        if (image == null || image.isEmpty()) {
            throw new MissingImageException(Map.of("image", "Image is required"));
        }

        // Convert requestJson to CategoryRequest
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        CategoryRequest request = objectMapper.readValue(requestJson, CategoryRequest.class);

        // Validate the deserialized CategoryRequest object
        Set<ConstraintViolation<CategoryRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Create the category
        CategoryResponse categoryResponse = categoryService.create(request, image);

        // Return the response
        return ApiResponse.<CategoryResponse>builder().result(categoryResponse).build();
    }

    @GetMapping
    ApiResponse<List<CategoryResponse>> getAllCategory() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAll())
                .build();
    }

    @PutMapping(value = "/{categoryId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @RequestPart("request") String requestJson,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        CategoryRequest request = objectMapper.readValue(requestJson, CategoryRequest.class);

        // Validate the deserialized UpdateProductRequest object
        Set<ConstraintViolation<CategoryRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        CategoryResponse updatedCategory = categoryService.update(categoryId, request, image);

        return ApiResponse.<CategoryResponse>builder().result(updatedCategory).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getProductById(@PathVariable Long id) {

        CategoryResponse categoryResponse = categoryService.getById(id);

        return ApiResponse.<CategoryResponse>builder().result(categoryResponse).build();
    }

    @GetMapping("/search")
    public ApiResponse<List<CategoryResponse>> searchByKeyword(@RequestParam String keyword) {

        List<CategoryResponse> categories = categoryService.searchByKeyword(keyword);

        return ApiResponse.<List<CategoryResponse>>builder().result(categories).build();
    }

    @GetMapping("/pagination-sort")
    public ApiResponse<PageResponse<CategoryResponse>> getAllPaginationSortCategories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        PageResponse<CategoryResponse> categories = categoryService.getAllCategories(page, size, sortBy, sortDirection);

        return ApiResponse.<PageResponse<CategoryResponse>>builder()
                .result(categories)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) throws IOException {
        categoryService.delete(id);
        return ApiResponse.<Void>builder().message("Category deleted").build();
    }

    @PatchMapping("/{id}/toggle-disable")
    public ApiResponse<CategoryResponse> toggleDisabledCategory(@PathVariable Long id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.toggleDisabled(id))
                .build();
    }
}
