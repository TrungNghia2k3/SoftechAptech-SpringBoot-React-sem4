package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Cart;
import com.devteria.identityservice.entity.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartProductRepository extends JpaRepository<CartProduct, Long> {

    CartProduct findByCartIdAndProductId(Long cartId, String productId);

    List<CartProduct> findByCartId(Long cartId);

}
