import React from "react";
import { ListGroup } from "react-bootstrap";
import {
  BsBell,
  BsCart,
  BsCash,
  BsGift,
  BsHeart,
  BsHouse,
  BsKey,
  BsPerson
} from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./UserSidebar.scss";

const UserSidebar = () => {
  return (
    <div className="user-sidebar">
      <ListGroup>
        <ListGroup.Item>
          <NavLink to="/user/profile" activeClassName="active">
            <BsPerson className="icon" /> Profile
          </NavLink>
        </ListGroup.Item>
        {/* New items added below */}
        <ListGroup.Item>
          <NavLink to="/user/addresses" activeClassName="active">
            <BsHouse className="icon" /> Addresses
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/change-password" activeClassName="active">
            <BsKey className="icon" /> Change Password
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/order-tracking" activeClassName="active">
            <FaShippingFast className="icon" /> Order Tracking
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/cart" activeClassName="active">
            <BsCart className="icon" /> Cart
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/notification" activeClassName="active">
            <BsBell className="icon" /> Notification
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/wishlist" activeClassName="active">
            <BsHeart className="icon" /> Wishlist
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/redeem-point" activeClassName="active">
            <BsGift className="icon" /> Redeem Point
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/user/wallet-coupon" activeClassName="active">
            <BsCash className="icon" /> Wallet Coupon
          </NavLink>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default UserSidebar;
