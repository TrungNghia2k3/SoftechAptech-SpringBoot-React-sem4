package com.devteria.identityservice.service;

import com.devteria.identityservice.constant.CartStatus;
import com.devteria.identityservice.dto.request.CartProductRequest;
import com.devteria.identityservice.dto.response.CartProductResponse;
import com.devteria.identityservice.dto.response.CartResponse;
import com.devteria.identityservice.dto.response.ProductResponse;
import com.devteria.identityservice.entity.Cart;
import com.devteria.identityservice.entity.CartProduct;
import com.devteria.identityservice.entity.Product;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.exception.AppException;
import com.devteria.identityservice.exception.ErrorCode;
import com.devteria.identityservice.mapper.ProductMapper;
import com.devteria.identityservice.repository.CartProductRepository;
import com.devteria.identityservice.repository.CartRepository;
import com.devteria.identityservice.repository.ProductRepository;
import com.devteria.identityservice.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {
    private static final String BASE_IMAGE_URL = "http://localhost:8080/api/images/product/";
    CartRepository cartRepository;
    CartProductRepository cartProductRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ProductMapper productMapper;


    public CartResponse addToCart(String userId, String productId, int quantity) {

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Find or create active cart for the user
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE);

        if (cart == null) {
            // Create a new cart if it doesn't exist
            cart = new Cart();
            cart.setUser(user);
            cart.setCreatedDate(new Date());
            cart.setStatus(CartStatus.ACTIVE);
            cart = cartRepository.save(cart);
        }

        // Find the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Check if the product is already in the cart
        CartProduct cartProduct = cartProductRepository.findByCartIdAndProductId(cart.getId(), productId);

        // Check available stock
        int availableStock = product.getInStock();
        if (quantity > availableStock) {
            throw new AppException(ErrorCode.EXCEEDS_QUANTITY);
        }

        if (cartProduct == null) {
            // Product not in cart, add new entry
            cartProduct = new CartProduct();
            cartProduct.setCart(cart);
            cartProduct.setProduct(product);
            cartProduct.setQuantity(quantity);
            cartProduct.setTotalPrice(product.getPrice() * quantity);

        } else {
            // Product already in cart, update quantity and total price
            int newQuantity = cartProduct.getQuantity() + quantity;
            if (newQuantity > availableStock) {
                throw new AppException(ErrorCode.EXCEEDS_QUANTITY);
            }
            cartProduct.setQuantity(newQuantity);
            cartProduct.setTotalPrice(product.getPrice() * newQuantity);
        }

        // Save the updated cart product
        cartProductRepository.save(cartProduct);

        // Calculate total quantity and total price for the cart
        List<CartProduct> cartProducts = cartProductRepository.findByCartId(cart.getId());

        Integer totalQuantity = cartProducts.stream()
                .mapToInt(CartProduct::getQuantity)
                .sum();

        Long totalPrice = cartProducts.stream()
                .mapToLong(CartProduct::getTotalPrice)
                .sum();

        // Map CartProduct to include full image URLs
        List<CartProductResponse> cartProductResponses = cartProducts.stream()
                .map(cp -> {
                    Product productItem = cp.getProduct();
                    ProductResponse productResponse = mapToProductResponse(productItem);
                    return CartProductResponse.builder()
                            .id(cp.getId())
                            .quantity(cp.getQuantity())
                            .totalPrice(cp.getTotalPrice())
                            .product(productResponse)
                            .build();
                })
                .collect(Collectors.toList());


        // Return the updated CartResponse
        return CartResponse.builder()
                .productQuantity(totalQuantity)
                .totalPriceProduct(totalPrice)
                .cartProducts(cartProductResponses)
                .build();
    }


    public CartResponse getCartByUserId(String userId) {
        // Find user
        userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Find active cart for the user
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE);

        if (cart == null) {
            throw new AppException(ErrorCode.ACTIVE_CART_NOT_FOUND);
        }

        // Retrieve products in the cart
        List<CartProduct> cartProducts = cartProductRepository.findByCartId(cart.getId());

        // Map CartProduct to include full image URLs
        List<CartProductResponse> cartProductResponses = cartProducts.stream()
                .map(cartProduct -> {
                    Product product = cartProduct.getProduct();
                    ProductResponse productResponse = mapToProductResponse(product);
                    return new CartProductResponse(
                            cartProduct.getId(),
                            cartProduct.getQuantity(),
                            cartProduct.getTotalPrice(),
                            productResponse
                    );
                })
                .collect(Collectors.toList());

        // Calculate total quantity and total price
        Integer totalQuantity = cartProducts.stream()
                .mapToInt(CartProduct::getQuantity)
                .sum();

        // Calculate total price using a loop
        Long totalPrice = 0L;
        for (CartProduct cartProduct : cartProducts) {
            totalPrice += cartProduct.getTotalPrice();
        }

        // Return the result
        return CartResponse.builder()
                .productQuantity(totalQuantity)
                .totalPriceProduct(totalPrice)
                .cartProducts(cartProductResponses)
                .build();
    }

    public CartResponse removeProductFromCart(String userId, String productId) {
        // Tìm giỏ hàng của user có trạng thái "ACTIVE"
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE);

        if (cart == null) {
            throw new AppException(ErrorCode.ACTIVE_CART_NOT_FOUND);
        }

        // Tìm cart_product theo cart_id và product_id
        CartProduct cartProduct = cartProductRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (cartProduct == null) {
            throw new AppException(ErrorCode.CART_PRODUCT_NOT_FOUND);
        }

        // Xóa cart_product
        cartProductRepository.delete(cartProduct);

        // Lấy danh sách sản phẩm còn lại trong giỏ hàng
        List<CartProduct> remainingCartProducts = cartProductRepository.findByCartId(cart.getId());

        // Tính toán tổng số lượng và giá trị của các sản phẩm còn lại
        Integer totalQuantity = remainingCartProducts.stream()
                .mapToInt(CartProduct::getQuantity)
                .sum();

        Long totalPrice = remainingCartProducts.stream()
                .mapToLong(CartProduct::getTotalPrice)
                .sum();

        // Map CartProduct to include full image URLs
        List<CartProductResponse> cartProductResponses = remainingCartProducts.stream()
                .map(cp -> {
                    Product productItem = cp.getProduct();
                    ProductResponse productResponse = mapToProductResponse(productItem);
                    return CartProductResponse.builder()
                            .id(cp.getId())
                            .quantity(cp.getQuantity())
                            .totalPrice(cp.getTotalPrice())
                            .product(productResponse)
                            .build();
                })
                .collect(Collectors.toList());

        // Tạo và trả về CartResponse
        return CartResponse.builder()
                .productQuantity(totalQuantity)
                .totalPriceProduct(totalPrice)
                .cartProducts(cartProductResponses)
                .build();
    }

    public CartResponse editCartProductQuantities(String userId, List<CartProductRequest> products) {
        // Find active cart for the user
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE);

        if (cart == null) {
            throw new AppException(ErrorCode.ACTIVE_CART_NOT_FOUND);
        }

        // List to keep track of updated CartProducts
        List<CartProduct> updatedCartProducts = new ArrayList<>();

        // Loop through the products to find and update quantities
        for (CartProductRequest request : products) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if (request.getQuantity() > product.getInStock()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }

            CartProduct cartProduct = cartProductRepository
                    .findByCartIdAndProductId(cart.getId(), request.getProductId());

            if (cartProduct == null) {
                throw new AppException(ErrorCode.CART_PRODUCT_NOT_FOUND);
            }

            // Update quantity if needed
            if (!cartProduct.getQuantity().equals(request.getQuantity())) {
                cartProduct.setQuantity(request.getQuantity());
                cartProduct.setTotalPrice(product.getPrice() * request.getQuantity());
                cartProductRepository.save(cartProduct);
            }

            // Add updated product to the list
            updatedCartProducts.add(cartProduct);
        }

        // Calculate updated total quantity and price
        Integer totalQuantity = updatedCartProducts.stream()
                .mapToInt(CartProduct::getQuantity)
                .sum();

        Long totalPrice = updatedCartProducts.stream()
                .mapToLong(CartProduct::getTotalPrice)
                .sum();

        // Map CartProduct to include full image URLs
        List<CartProductResponse> cartProductResponses = updatedCartProducts.stream()
                .map(cp -> {
                    Product productItem = cp.getProduct();
                    ProductResponse productResponse = mapToProductResponse(productItem);
                    return CartProductResponse.builder()
                            .id(cp.getId())
                            .quantity(cp.getQuantity())
                            .totalPrice(cp.getTotalPrice())
                            .product(productResponse)
                            .build();
                })
                .collect(Collectors.toList());

        // Return the updated CartResponse
        return CartResponse.builder()
                .productQuantity(totalQuantity)
                .totalPriceProduct(totalPrice)
                .cartProducts(cartProductResponses)
                .build();
    }


    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = productMapper.toProductResponse(product);

        response.setImageMain(buildImageUrl(product.getId(), product.getImageMain()));

        response.setImageSubOne(buildImageUrl(product.getId(), product.getImageSubOne()));

        response.setImageSubTwo(buildImageUrl(product.getId(), product.getImageSubTwo()));

        return response;
    }

    private String buildImageUrl(String productId, String imageName) {
        return BASE_IMAGE_URL + productId + "/" + imageName;
    }

}
