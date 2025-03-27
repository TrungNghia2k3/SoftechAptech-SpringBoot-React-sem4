import React from "react";
import { ListGroup } from "react-bootstrap";
import { ChatDotsFill, GraphUpArrow, Receipt, Truck } from "react-bootstrap-icons";
import {
  BsBox,
  BsBuilding,
  BsChatDots,
  BsClipboardData,
  BsHouseDoor,
  BsPeople,
  BsTags,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.scss";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <ListGroup>
        <ListGroup.Item>
          <NavLink to="/admin/dashboard" activeClassName="active">
            <BsHouseDoor className="icon" /> Dashboard
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/users">
            <BsPeople className="icon" /> Users
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/products">
            <BsBox className="icon" /> Products
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/categories">
            <BsTags className="icon" /> Categories
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/publishers">
            <BsBuilding className="icon" /> Publishers
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/orders">
            <BsClipboardData className="icon" /> Orders
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/feedbacks">
            <BsChatDots className="icon" /> Feedbacks
          </NavLink>
        </ListGroup.Item>

        {/* New features */}

        <ListGroup.Item>
          <NavLink to="/admin/manufactures">
            <Truck className="icon" /> Manufactures
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/coupons">
            <Receipt className="icon" /> Coupons
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/inventory">
            <GraphUpArrow className="icon" /> Inventory
          </NavLink>
        </ListGroup.Item>
        <ListGroup.Item>
          <NavLink to="/admin/comments">
            <ChatDotsFill className="icon" /> Comments
          </NavLink>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default AdminSidebar;
