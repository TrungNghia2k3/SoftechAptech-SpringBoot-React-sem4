package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByUserId(String userId);

    List<Order> findByOrderStatus(String orderStatus);
}
