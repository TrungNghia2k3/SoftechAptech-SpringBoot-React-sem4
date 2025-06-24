package com.ntn.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ntn.ecommerce.entity.Coupon;
import com.ntn.ecommerce.entity.User;
import com.ntn.ecommerce.entity.UserCoupons;

@Repository
public interface UserCouponsRepository extends JpaRepository<UserCoupons, Long> {

    Optional<UserCoupons> findByUserAndCoupon(User user, Coupon coupon);

    List<UserCoupons> findAllByUserId(String userId);

    List<UserCoupons> findByUserIdAndCouponIdIn(String userId, List<String> couponIds);
}
