package com.ntn.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.CartProduct;

@Repository
public interface CartProductRepository extends JpaRepository<CartProduct, Long> {

    CartProduct findByCartIdAndProductId(Long cartId, String productId);

    List<CartProduct> findByCartId(Long cartId);
}
