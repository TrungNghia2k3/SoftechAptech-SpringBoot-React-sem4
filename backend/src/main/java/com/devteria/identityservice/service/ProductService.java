package com.devteria.identityservice.service;

import com.devteria.identityservice.dto.request.ProductRequest;
import com.devteria.identityservice.dto.response.PageResponse;
import com.devteria.identityservice.dto.response.ProductRankingResponse;
import com.devteria.identityservice.dto.response.ProductResponse;
import com.devteria.identityservice.entity.*;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.ProductMapper;
import com.devteria.identityservice.repository.CartRepository;
import com.devteria.identityservice.repository.CategoryRepository;
import com.devteria.identityservice.repository.ProductRepository;
import com.devteria.identityservice.repository.PublisherRepository;
import com.devteria.identityservice.utilities.AudioUtilities;
import com.devteria.identityservice.utilities.ImageUtilities;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {
    private static final String BASE_IMAGE_URL = "http://localhost:8080/api/images/product/";
    private static final String BASE_AUDIO_URL = "http://localhost:8080/api/audio/product/";
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    PublisherRepository publisherRepository;
    CartRepository cartRepository;
    ProductMapper productMapper;
    ImageUtilities imageUtilities;
    AudioUtilities audioUtilities;


    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse createProduct(ProductRequest request,
                                         MultipartFile imageMain,
                                         MultipartFile imageSubOne,
                                         MultipartFile imageSubTwo,
                                         MultipartFile audio) throws IOException {

        // Convert ProductRequest to Product entity
        Product product = productMapper.toProduct(request); // category null, publisher

        // Retrieve the category and publisher
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Publisher publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));

        if (productRepository.existsByTitleOrIsbn10OrIsbn13(request.getTitle(), request.getIsbn10(), request.getIsbn13())) {
            throw new AppException(ErrorCode.PRODUCT_ALREADY_EXISTS);
        }

        // Get category and publisher codes
        String categoryCode = category.getCode();
        String publisherCode = publisher.getCode();

        // Generate the product ID
        String productId = generateProductId(categoryCode, publisherCode);

        // Set the generated product ID, category, and publisher
        product.setId(productId);
        product.setCategory(category);
        product.setPublisher(publisher);
        product.setInStock(0);
        product.setSoldItems(0);

        // Save the product to generate its ID
        product = productRepository.save(product);

        // Handle main image upload if provided
        if (imageMain != null && !imageMain.isEmpty()) {
            String mainImagePath = imageUtilities.saveFile(
                    "product",
                    product.getId(),
                    imageMain.getOriginalFilename(),
                    imageMain);
            product.setImageMain(mainImagePath);
        }

        // Handle sub image one upload if provided
        if (imageSubOne != null && !imageSubOne.isEmpty()) {
            String subImagePath = imageUtilities.saveFile(
                    "product",
                    product.getId(),
                    imageSubOne.getOriginalFilename(),
                    imageSubOne);
            product.setImageSubOne(subImagePath);
        }

        // Handle sub image two upload if provided
        if (imageSubTwo != null && !imageSubTwo.isEmpty()) {
            String subImagePath = imageUtilities.saveFile(
                    "product",
                    product.getId(),
                    imageSubTwo.getOriginalFilename(),
                    imageSubTwo);
            product.setImageSubTwo(subImagePath);
        }

        // Handle audio upload if provided
        if (audio != null && !audio.isEmpty()) {
            String audioPath = audioUtilities.saveAudioFile(
                    product.getId(),
                    audio.getOriginalFilename(),
                    audio);
            product.setAudio(audioPath);
        }

        // Save the updated product with images
        Product savedProduct = productRepository.save(product);

        // Map to response and return
        return mapToProductResponse(savedProduct);
    }


    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse updateProduct(String id,
                                         ProductRequest request,
                                         MultipartFile imageMain,
                                         MultipartFile imageSubOne,
                                         MultipartFile imageSubTwo,
                                         MultipartFile audio) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Publisher publisher = publisherRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));


        if ((!product.getTitle().equals(request.getTitle()) &&
                productRepository.existsByTitleAndIdNot(request.getTitle(), product.getId())) ||
                (!product.getIsbn10().equals(request.getIsbn10()) &&
                        productRepository.existsByIsbn10AndIdNot(request.getIsbn10(), product.getId())) ||
                (!product.getIsbn13().equals(request.getIsbn13()) &&
                        productRepository.existsByIsbn13AndIdNot(request.getIsbn13(), product.getId()))) {

            throw new AppException(ErrorCode.PRODUCT_ALREADY_EXISTS);
        }

        // Xóa ảnh cũ nếu có ảnh mới và ảnh cũ tồn tại
        if (imageMain != null && !imageMain.isEmpty() && product.getImageMain() != null && !product.getImageMain().isEmpty()) {
            imageUtilities.deleteFile("product",
                    id,
                    product.getImageMain());
        }

        if (imageSubOne != null && !imageSubOne.isEmpty() && product.getImageSubOne() != null && !product.getImageSubOne().isEmpty()) {
            imageUtilities.deleteFile("product",
                    id,
                    product.getImageSubOne());
        }
        if (imageSubTwo != null && !imageSubTwo.isEmpty() && product.getImageSubTwo() != null && !product.getImageSubTwo().isEmpty()) {
            imageUtilities.deleteFile("product",
                    id,
                    product.getImageSubTwo());
        }

        // Xóa tệp âm thanh cũ nếu có tệp mới và tệp cũ tồn tại
        if (audio != null && !audio.isEmpty() && product.getAudio() != null && !product.getAudio().isEmpty()) {
            audioUtilities.deleteAudioFile(
                    id,
                    product.getAudio());
        }

        // Update product fields
        productMapper.updateProductFromRequest(product, request);
        product.setCategory(category);
        product.setPublisher(publisher);

        // Save new images
        if (imageMain != null && !imageMain.isEmpty()) {
            String mainImagePath = imageUtilities.saveFile(
                    "product",
                    String.valueOf(product.getId()),
                    imageMain.getOriginalFilename(),
                    imageMain);
            product.setImageMain(mainImagePath);
        }

        if (imageSubOne != null && !imageSubOne.isEmpty()) {
            String subImagePath = imageUtilities.saveFile(
                    "product",
                    String.valueOf(product.getId()),
                    imageSubOne.getOriginalFilename(),
                    imageSubOne);
            product.setImageSubOne(subImagePath);
        }

        if (imageSubTwo != null && !imageSubTwo.isEmpty()) {
            String subImagePath = imageUtilities.saveFile(
                    "product",
                    String.valueOf(product.getId()),
                    imageSubTwo.getOriginalFilename(),
                    imageSubTwo);
            product.setImageSubTwo(subImagePath);
        }

        // Save new audio file
        if (audio != null && !audio.isEmpty()) {
            String audioFilePath = audioUtilities.saveAudioFile(
                    String.valueOf(product.getId()),
                    audio.getOriginalFilename(),
                    audio);
            product.setAudio(audioFilePath);
        }

        // Save updated product
        Product updatedProduct = productRepository.save(product);

        // Map to response and return
        return mapToProductResponse(updatedProduct);
    }

    public ProductResponse getById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return mapToProductResponse(product);
    }

    public PageResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);

        Page<Product> products = productRepository.findAll(pageable);

        Page<ProductResponse> productResponses = products.map(this::mapToProductResponse);

        return new PageResponse<>(productResponses);
    }

//    public List<ProductResponse> getAllProducts(String sortBy, String sortDirection) {
//        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.fromString(sortDirection), sortBy));
//
//        return products.stream()
//                .map(this::mapToProductResponse)
//                .collect(Collectors.toList());
//    }


    public PageResponse<ProductResponse> filterProducts(
            Long categoryId,
            Long publisherId,
            List<String> formality,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String title,
            Pageable pageable) {

        Page<Product> products = productRepository.filterProducts(
                categoryId,
                publisherId,
                formality,
                minPrice,
                maxPrice,
                title,
                pageable);
        Page<ProductResponse> productResponses = products.map(this::mapToProductResponse);

        return new PageResponse<>(productResponses);
    }


    public List<ProductResponse> getAllProductsByCategoryId(Long categoryId) {

        // Fetch all products by category ID
        List<Product> products = productRepository.findProductByCategoryId(categoryId);

        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        // Filter products with inStock > 0 (ignoring null values) and map to ProductResponse using MapStruct
        return products.stream()
//                .filter(product -> product.getInStock() != null && product.getInStock() > 0)
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductsByPublisherId(Long publisherId) {

        // Fetch all products by category ID
        List<Product> products = productRepository.findProductByPublisherId(publisherId);

        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        // Filter products with inStock > 0 (ignoring null values) and map to ProductResponse using MapStruct
        return products.stream()
//                .filter(product -> product.getInStock() != null && product.getInStock() > 0)
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductsByAuthorName(String authorName) {

        // Fetch all products by category ID
        List<Product> products = productRepository.findByAuthor(authorName);

        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        // Filter products with inStock > 0 (ignoring null values) and map to ProductResponse using MapStruct
        return products.stream()
//                .filter(product -> product.getInStock() != null && product.getInStock() > 0)
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);
        return products.stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductRankingResponse> getRankingMostPopularProducts() {
        Map<Product, ProductRankingResponse> productRankingMap = new HashMap<>();

        // Retrieve all carts with their products
        List<Cart> carts = cartRepository.findAll();  // Assuming you have a cartRepository to fetch all carts

        // Iterate through all carts and their products
        for (Cart cart : carts) {
            for (CartProduct cartProduct : cart.getCartProducts()) {
                Product product = cartProduct.getProduct();
                int quantity = cartProduct.getQuantity();

                // If the product is not yet in the map, initialize it
                productRankingMap.putIfAbsent(product, new ProductRankingResponse(product, 0L));

                // Update totalQuantity for all products
                productRankingMap.get(product).setTotalQuantity(
                        productRankingMap.get(product).getTotalQuantity() + quantity
                );
            }
        }

        // Convert the map to a list and sort by totalQuantity in descending order
        return productRankingMap.values().stream()
                .sorted(Comparator.comparing(ProductRankingResponse::getTotalQuantity).reversed())
                .collect(Collectors.toList());
    }


    private Pageable createPageable(int page, int size, String sortBy, String sortDirection) {
        // Adjust page number to start from 0 instead of 1
        int adjustedPage = (page > 0) ? page - 1 : 0;

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return PageRequest.of(adjustedPage, size, sort);
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

    private String generateProductId(String categoryCode, String publisherCode) {
        // Find the maximum order number for existing products with the same category and publisher
        List<Product> products = productRepository.findByCategoryCodeAndPublisherCode(categoryCode, publisherCode);
        int maxOrder = products.stream()
                .mapToInt(p -> {
                    String id = p.getId();
                    String orderStr = id.substring(categoryCode.length() + publisherCode.length());
                    return Integer.parseInt(orderStr);
                })
                .max()
                .orElse(0);

        // Increment the order number
        int nextOrder = maxOrder + 1;

        // Generate the new product ID
        return String.format("%s%s%03d", categoryCode, publisherCode, nextOrder);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }


}
