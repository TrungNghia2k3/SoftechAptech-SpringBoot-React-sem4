package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon,String> {
    Optional<Coupon> findByType(String type);
    boolean existsByType(String type);
}
