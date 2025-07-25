package com.ntn.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUserIdAndStatus(String userId, String status);
}
