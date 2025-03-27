import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CouponCard from "../../components/user/coupon/CouponCard";
import { getAllCouponsByUserId } from "../../services/couponService";

const WalletCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user.id;
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getAllCouponsByUserId(userId);
        setCoupons(data.result);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [userId]);

  return (
    <>
      <h3 className="fw-bold">Wallet Coupons</h3>
      {coupons.map((coupon) => (
        <CouponCard
          key={coupon.id}
          id={coupon.coupon.id}
          type={coupon.coupon.type}
          value={coupon.coupon.value}
          description={coupon.coupon.description}
          minOrderValue={coupon.coupon.minOrderValue}
          quantity={coupon.quantity}
        />
      ))}
    </>
  );
};

export default WalletCoupon;
