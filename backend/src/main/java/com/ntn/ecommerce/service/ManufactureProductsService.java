package com.ntn.ecommerce.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ntn.ecommerce.dto.request.ManufactureProductsRequest;
import com.ntn.ecommerce.dto.response.ManufactureProductsResponse;
import com.ntn.ecommerce.dto.response.ProductManufactureDetailResponse;
import com.ntn.ecommerce.dto.response.ProductResponse;
import com.ntn.ecommerce.entity.Manufacture;
import com.ntn.ecommerce.entity.ManufactureProducts;
import com.ntn.ecommerce.entity.Product;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.mapper.ProductMapper;
import com.ntn.ecommerce.repository.ManufactureProductsRepository;
import com.ntn.ecommerce.repository.ManufactureRepository;
import com.ntn.ecommerce.repository.ProductRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ManufactureProductsService {

    private static final String BASE_IMAGE_URL = "http://localhost:8080/api/images/product/";
    private static final String BASE_AUDIO_URL = "http://localhost:8080/api/audio/product/";
    ManufactureRepository manufactureRepository;
    ProductRepository productRepository;
    ManufactureProductsRepository manufactureProductsRepository;
    ProductMapper productMapper;

    public ManufactureProductsResponse importProduct(ManufactureProductsRequest request) {

        // Tìm product có tồn tại không?
        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Tìm manufacture có tồn tại không?
        Manufacture manufacture = manufactureRepository
                .findById(request.getManufactureId())
                .orElseThrow(() -> new AppException(ErrorCode.MANUFACTURE_NOT_FOUND));

        // Tạo một đối tượng ManufactureProducts mới
        ManufactureProducts manufactureProducts = ManufactureProducts.builder()
                .manufacture(manufacture)
                .product(product)
                .quantity(request.getQuantity())
                .entryDate(LocalDate.now()) // entryDate là ngày giờ hiện tại
                .priceOfUnits(request.getPriceOfUnits())
                .build();

        // Cập nhật số lượng InStock của product

        product.setInStock(product.getInStock() + request.getQuantity());
        productRepository.save(product);

        // Lưu đối tượng ManufactureProducts mới
        manufactureProducts = manufactureProductsRepository.save(manufactureProducts);

        // Trả về response
        return ManufactureProductsResponse.builder()
                .id(manufactureProducts.getId())
                .manufacture(manufacture)
                .product(product)
                .quantity(manufactureProducts.getQuantity())
                .entryDate(manufactureProducts.getEntryDate())
                .priceOfUnits(manufactureProducts.getPriceOfUnits())
                .build();
    }

    public List<ProductManufactureDetailResponse> getManufacturesByProductId(String productId) {
        return manufactureProductsRepository.findByProductId(productId).stream()
                .map(productManufactureDetail -> ProductManufactureDetailResponse.builder()
                        .id(productManufactureDetail.getId())
                        .manufactureName(
                                productManufactureDetail.getManufacture().getName())
                        .quantity(productManufactureDetail.getQuantity())
                        .priceOfUnits(productManufactureDetail.getPriceOfUnits())
                        .entryDate(productManufactureDetail.getEntryDate())
                        .productId(productManufactureDetail.getProduct().getId())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductsByManufactureId(Long manufactureId) {
        // Step 1: Get all ManufactureProducts by Manufacture ID
        List<ManufactureProducts> manufactureProducts =
                manufactureProductsRepository.findAllByManufactureId(manufactureId);

        if (manufactureProducts.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        // Step 2: Extract Product IDs from ManufactureProducts
        List<String> productIds = manufactureProducts.stream()
                .map(manufactureProduct -> manufactureProduct.getProduct().getId())
                .collect(Collectors.toList());

        // Step 3: Find all Products by these Product IDs
        List<Product> products = productRepository.findAllById(productIds);

        // Step 4: Map Products to ProductResponse
        return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    public ManufactureProductsResponse getManufactureProductById(Long manufactureProductId) {
        // Tìm đối tượng ManufactureProducts dựa trên ID
        ManufactureProducts manufactureProducts = manufactureProductsRepository
                .findById(manufactureProductId)
                .orElseThrow(() -> new AppException(ErrorCode.MANUFACTURE_PRODUCT_NOT_FOUND));

        return ManufactureProductsResponse.builder()
                .id(manufactureProducts.getId())
                .manufacture(manufactureProducts.getManufacture())
                .product(manufactureProducts.getProduct())
                .quantity(manufactureProducts.getQuantity())
                .entryDate(LocalDate.now())
                .priceOfUnits(manufactureProducts.getPriceOfUnits())
                .build();
    }

    public ManufactureProductsResponse editManufactureProduct(
            Long manufactureProductId, ManufactureProductsRequest request) {
        // Find the ManufactureProducts entity by ID
        ManufactureProducts manufactureProducts = manufactureProductsRepository
                .findById(manufactureProductId)
                .orElseThrow(() -> new AppException(ErrorCode.MANUFACTURE_PRODUCT_NOT_FOUND));

        // Store old quantity for inStock update
        int oldQuantity = manufactureProducts.getQuantity();

        // Check if the product ID in manufactureProducts matches the one in the request
        if (!manufactureProducts.getProduct().getId().equals(request.getProductId())) {
            throw new AppException(ErrorCode.PRODUCT_MISMATCH);
        }

        // Check if the requested manufacture ID is different from the current one
        if (!manufactureProducts.getManufacture().getId().equals(request.getManufactureId())) {
            // Find the manufacture by ID
            Manufacture manufacture = manufactureRepository
                    .findById(request.getManufactureId())
                    .orElseThrow(() -> new AppException(ErrorCode.MANUFACTURE_NOT_FOUND));

            // Update the manufacture in manufactureProducts
            manufactureProducts.setManufacture(manufacture);
        }

        // Update ManufactureProducts details
        manufactureProducts.setQuantity(request.getQuantity());
        manufactureProducts.setPriceOfUnits(request.getPriceOfUnits());
        manufactureProducts.setEntryDate(LocalDate.now());

        // Update product's inStock quantity
        Product product = manufactureProducts.getProduct();
        product.setInStock(product.getInStock() - oldQuantity + request.getQuantity());
        productRepository.save(product);

        // Save the updated ManufactureProducts entity
        manufactureProducts = manufactureProductsRepository.save(manufactureProducts);

        // Build and return the response
        return ManufactureProductsResponse.builder()
                .id(manufactureProducts.getId())
                .manufacture(manufactureProducts.getManufacture())
                .product(product)
                .quantity(manufactureProducts.getQuantity())
                .entryDate(manufactureProducts.getEntryDate())
                .priceOfUnits(manufactureProducts.getPriceOfUnits())
                .build();
    }

    public void deleteManufactureProduct(Long manufactureProductId) {
        // Tìm đối tượng ManufactureProducts để lấy thông tin
        ManufactureProducts manufactureProducts = manufactureProductsRepository
                .findById(manufactureProductId)
                .orElseThrow(() -> new AppException(ErrorCode.MANUFACTURE_PRODUCT_NOT_FOUND));

        // Tìm sản phẩm tương ứng
        Product product = manufactureProducts.getProduct();

        // Cập nhật lại số lượng inStock của sản phẩm
        product.setInStock(product.getInStock() - manufactureProducts.getQuantity());
        productRepository.save(product);

        // Xóa đối tượng ManufactureProducts
        manufactureProductsRepository.delete(manufactureProducts);
    }

    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = productMapper.toProductResponse(product);

        response.setImageMain(buildImageUrl(product.getId(), product.getImageMain()));

        if (response.getImageSubOne() != null) {
            response.setImageSubOne(buildImageUrl(product.getId(), product.getImageSubOne()));
        }

        if (response.getImageSubTwo() != null) {
            response.setImageSubTwo(buildImageUrl(product.getId(), product.getImageSubTwo()));
        }

        if (response.getAudio() != null) {
            response.setAudio(buildAudioUrl(product.getId(), product.getAudio()));
        }

        return response;
    }

    private String buildImageUrl(String productId, String imageName) {
        return BASE_IMAGE_URL + productId + "/" + imageName;
    }

    private String buildAudioUrl(String productId, String audioName) {
        return BASE_AUDIO_URL + productId + "/" + audioName;
    }
}
