package com.ntn.ecommerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ntn.ecommerce.dto.response.WishlistResponse;
import com.ntn.ecommerce.entity.Wishlist;
import com.ntn.ecommerce.exception.AppException;
import com.ntn.ecommerce.exception.ErrorCode;
import com.ntn.ecommerce.repository.ProductRepository;
import com.ntn.ecommerce.repository.UserRepository;
import com.ntn.ecommerce.repository.WishlistRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class WishlistService {

    WishlistRepository wishlistRepository;
    ProductRepository productRepository;
    UserRepository userRepository;

    public WishlistResponse getWishlistByUserId(String userId) {
        // Lấy tất cả wishlist của người dùng
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);

        // Tạo WishlistResponse
        WishlistResponse wishlistResponse = new WishlistResponse();
        wishlistResponse.setProducts(wishlists.stream()
                .map(Wishlist::getProduct) // Lấy Product từ Wishlist
                .collect(Collectors.toList()));

        return wishlistResponse;
    }

    public void addProductToWishlist(String userId, String productId) {
        // Kiểm tra xem sản phẩm đã có trong wishlist chưa
        if (!checkIfInWishlist(userId, productId)) {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(
                    userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
            wishlist.setProduct(productRepository
                    .findById(productId)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND)));
            wishlistRepository.save(wishlist);
        }
    }

    public void removeProductFromWishlist(String userId, String productId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (wishlist != null) {
            wishlistRepository.delete(wishlist);
        }
    }

    public boolean checkIfInWishlist(String userId, String productId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(userId, productId);
        return wishlist != null;
    }
}
