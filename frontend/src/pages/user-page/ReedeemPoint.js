import React, { useEffect, useState } from "react";
import RedeemCouponCard from "../../components/user/redeem/RedeemCouponCard";
import { getAllCoupons } from "../../services/couponService";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const ReedeemPoint = () => {
  const [coupons, setCoupons] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const userId = user.id;

  useEffect(() => {
    setUserPoints(user.points); // Initialize points
    const fetchCoupons = async () => {
      try {
        const data = await getAllCoupons();
        setCoupons(data.result);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [user.points, userId]);

  const handleUpdatePoints = (pointCost) => {
    setUserPoints((prevPoints) => prevPoints - pointCost);
  };

  return (
    <>
      <h3 className="fw-bold">Redeem Point</h3>
      <h6>Current points: {userPoints}</h6>
      {coupons.map((coupon) => (
        <RedeemCouponCard
          key={coupon.id}
          id={coupon.id}
          type={coupon.type}
          value={coupon.value}
          description={coupon.description}
          pointCost={coupon.pointCost}
          minOrderValue={coupon.minOrderValue}
          userId={userId}
          onRedeemSuccess={handleUpdatePoints} // Pass the handler
        />
      ))}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default ReedeemPoint;
