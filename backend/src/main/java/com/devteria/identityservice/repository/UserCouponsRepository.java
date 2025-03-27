package com.devteria.identityservice.repository;

import com.devteria.identityservice.entity.Coupon;
import com.devteria.identityservice.entity.User;
import com.devteria.identityservice.entity.UserCoupons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCouponsRepository extends JpaRepository<UserCoupons, Long> {

    Optional<UserCoupons> findByUserAndCoupon(User user, Coupon coupon);

    List<UserCoupons> findAllByUserId(String userId);

    List<UserCoupons> findByUserIdAndCouponIdIn(String userId, List<String> couponIds);
}

