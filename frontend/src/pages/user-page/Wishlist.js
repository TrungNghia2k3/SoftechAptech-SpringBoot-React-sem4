import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import WishlistItem from "../../components/user/wishlist/WishlistItem";
import { addProductToCart } from "../../features/cart/cartSlice";
import {
  getWishlistByUserId,
  removeProductFromWishlist,
} from "../../services/wishlistService";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlistByUserId(userId);
        setWishlist(response.result.products);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  const onAddToCart = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const resultAction = await dispatch(
        addProductToCart({ userId: user.id, productId: productId, quantity: 1 })
      );

      if (addProductToCart.fulfilled.match(resultAction)) {
        // Thông báo thành công
        toast.success("Product added to cart successfully!");
      } else {
        // Xử lý lỗi
        if (resultAction.payload) {
          // Lỗi từ phía server
          toast.error(
            resultAction.payload + ". Please check your shopping cart again"
          );
        } else {
          // Lỗi khác (mạng, không phản hồi, v.v.)
          toast.error("Failed to add product to cart.");
        }
      }
    } catch (error) {
      // Xử lý lỗi không mong đợi
      toast.error("An unexpected error occurred.");
    }
  };

  const onRemoveFromWishlist = async (productId) => {
    try {
      await removeProductFromWishlist(userId, productId); // Gọi API để xóa sản phẩm khỏi wishlist
      setWishlist(wishlist.filter((product) => product.id !== productId)); // Cập nhật danh sách wishlist sau khi xóa
      toast.success(`Product removed from wishlist.`);

    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  return (
    <>
      <h3 className="fw-bold">Wishlist</h3>
      {wishlist.map((product) => (
        <WishlistItem
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onRemoveFromWishlist={onRemoveFromWishlist}
        />
      ))}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Wishlist;
