package com.ntn.ecommerce.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.ntn.ecommerce.dto.request.ManufactureProductsRequest;
import com.ntn.ecommerce.dto.response.ApiResponse;
import com.ntn.ecommerce.dto.response.ManufactureProductsResponse;
import com.ntn.ecommerce.dto.response.ProductManufactureDetailResponse;
import com.ntn.ecommerce.service.ManufactureProductsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/manufacture-products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManufactureProductsController {
    ManufactureProductsService manufactureProductsService;

    @PostMapping("/import")
    public ApiResponse<ManufactureProductsResponse> importProduct(
            @RequestBody @Valid ManufactureProductsRequest manufactureProductsRequest) {
        return ApiResponse.<ManufactureProductsResponse>builder()
                .result(manufactureProductsService.importProduct(manufactureProductsRequest))
                .build();
    }

    @GetMapping("/product/{id}/manufactures")
    public ApiResponse<List<ProductManufactureDetailResponse>> getManufacturesByProductId(@PathVariable String id) {
        List<ProductManufactureDetailResponse> manufactures = manufactureProductsService.getManufacturesByProductId(id);
        return ApiResponse.<List<ProductManufactureDetailResponse>>builder()
                .result(manufactures)
                .build();
    }

    @GetMapping("/getById/{id}")
    public ApiResponse<ManufactureProductsResponse> getManufactureProductById(@PathVariable Long id) {
        return ApiResponse.<ManufactureProductsResponse>builder()
                .result(manufactureProductsService.getManufactureProductById(id))
                .build();
    }

    @PutMapping("/edit/{id}")
    public ApiResponse<ManufactureProductsResponse> editManufactureProduct(
            @PathVariable Long id, @RequestBody @Valid ManufactureProductsRequest manufactureProductsRequest) {
        return ApiResponse.<ManufactureProductsResponse>builder()
                .result(manufactureProductsService.editManufactureProduct(id, manufactureProductsRequest))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteManufactureProduct(@PathVariable Long id) {
        manufactureProductsService.deleteManufactureProduct(id);
        return ApiResponse.<Void>builder()
                .message("Product deleted successfully")
                .build();
    }
}
