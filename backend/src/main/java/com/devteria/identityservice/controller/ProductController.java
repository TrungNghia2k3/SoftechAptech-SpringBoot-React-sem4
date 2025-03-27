package com.devteria.identityservice.controller;

import com.devteria.identityservice.dto.request.ProductRequest;
import com.devteria.identityservice.dto.response.ApiResponse;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.dto.response.ProductRankingResponse;
import com.devteria.identityservice.dto.response.ProductResponse;
import com.devteria.identityservice.exception.MissingImageException;
import com.devteria.identityservice.service.ManufactureProductsService;
import com.devteria.identityservice.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;
    ManufactureProductsService manufactureProductsService;
    Validator validator;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> createProduct(
            @RequestPart("request") String requestJson,
            @RequestPart(name = "imageMain") MultipartFile imageMain,
            @RequestPart(name = "imageSubOne", required = false) MultipartFile imageSubOne,
            @RequestPart(name = "imageSubTwo", required = false) MultipartFile imageSubTwo,
            @RequestPart(name = "audio", required = false) MultipartFile audio)
            throws IOException {

        // Kiểm tra sự tồn tại của ảnh chính
        if (imageMain == null || imageMain.isEmpty()) {
            throw new MissingImageException(Map.of("imageMain", "imageMain is required"));
        }

        // Chuyển đổi requestJson sang ProductRequest
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        ProductRequest request = objectMapper.readValue(requestJson, ProductRequest.class);

        // Xác thực đối tượng ProductRequest đã được giải mã
        Set<ConstraintViolation<ProductRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Tạo sản phẩm
        ProductResponse productResponse = productService.createProduct(request, imageMain, imageSubOne, imageSubTwo, audio);

        // Trả về phản hồi
        return ApiResponse.<ProductResponse>builder().result(productResponse).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable String id) {
        ProductResponse productResponse = productService.getById(id);
        return ApiResponse.<ProductResponse>builder().result(productResponse).build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable String id,
            @RequestPart("request") String requestJson,
            @RequestPart(name = "imageMain", required = false) MultipartFile imageMain,
            @RequestPart(name = "imageSubOne", required = false) MultipartFile imageSubOne,
            @RequestPart(name = "imageSubTwo", required = false) MultipartFile imageSubTwo,
            @RequestPart(name = "audio", required = false) MultipartFile audio)
            throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        ProductRequest request = objectMapper.readValue(requestJson, ProductRequest.class);

        // Validate the deserialized UpdateProductRequest object
        Set<ConstraintViolation<ProductRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        ProductResponse productResponse = productService.updateProduct(id, request, imageMain, imageSubOne, imageSubTwo, audio);

        return ApiResponse.<ProductResponse>builder().result(productResponse).build();
    }

//    @GetMapping("/getAll")
//    public ApiResponse<List<ProductResponse>> getAllProducts(
//            @RequestParam(defaultValue = "id") String sortBy,
//            @RequestParam(defaultValue = "asc") String sortDirection) {
//
//        List<ProductResponse> products = productService.getAllProducts(sortBy, sortDirection);
//        return ApiResponse.<List<ProductResponse>>builder().result(products).build();
//    }

    @GetMapping("/getAll")
    public ApiResponse<PageResponse<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        PageResponse<ProductResponse> products = productService.getAllProducts(page, size, sortBy, sortDirection);
        return ApiResponse.<PageResponse<ProductResponse>>builder().result(products).build();
    }


    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<ProductResponse>> getAllProductsByCategoryId(@PathVariable Long categoryId) {
        return ApiResponse.<List<ProductResponse>>builder().result(productService.getAllProductsByCategoryId(categoryId)).build();
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long publisherId,
            @RequestParam(required = false) List<String> formality,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "true") boolean asc) {

        Pageable pageable = PageRequest.of(page, size, asc ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
        PageResponse<ProductResponse> pageResponse = productService.filterProducts(categoryId, publisherId, formality, minPrice, maxPrice, title, pageable);

        return ApiResponse.<PageResponse<ProductResponse>>builder().result(pageResponse).build();
    }

    @GetMapping("/publisher/{publisherId}")
    public ApiResponse<List<ProductResponse>> getAllProductsByPublisherId(@PathVariable Long publisherId) {
        return ApiResponse.<List<ProductResponse>>builder().result(productService.getAllProductsByPublisherId(publisherId)).build();
    }

    @GetMapping("/author/{authorName}")
    public ApiResponse<List<ProductResponse>> getAllProductsByAuthor(@PathVariable String authorName) {
        return ApiResponse.<List<ProductResponse>>builder().result(productService.getAllProductsByAuthorName(authorName)).build();
    }

    @GetMapping("/rankingMostPopularProducts")
    public ApiResponse<List<ProductRankingResponse>> getRankingMostPopularProducts() {
        return ApiResponse.<List<ProductRankingResponse>>builder().result(productService.getRankingMostPopularProducts()).build();
    }

    @GetMapping("/manufacture/{manufactureId}")
    public ApiResponse<List<ProductResponse>> getAllProductsByManufactureId(@PathVariable Long manufactureId) {
        return ApiResponse.<List<ProductResponse>>builder().result(manufactureProductsService.getAllProductsByManufactureId(manufactureId)).build();
    }

    @GetMapping("/search")
    public ApiResponse<List<ProductResponse>> searchProducts(@RequestParam String keyword) {
        List<ProductResponse> products = productService.searchProducts(keyword);

        return ApiResponse.<List<ProductResponse>>builder().result(products).build();
    }
}
