package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUserIdAndStatus(String userId, String status);
}
