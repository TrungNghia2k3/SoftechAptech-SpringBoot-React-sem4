import React, { useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Nav,
  Navbar,
} from "react-bootstrap";
import { HeartFill } from "react-bootstrap-icons";
import { BsCash, BsGift, BsHouse, BsKey, BsPerson } from "react-icons/bs";
import { FaSearch, FaShippingFast, FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import {
  fetchFilteredProducts,
  setFilters,
} from "../../features/products/productSlice";
import "./Header.scss"; // Updated import to use SCSS file
import MiniCart from "./MiniCart";
import NotificationsDropdown from "./NotificationsDropdown";

export default function Header({ isLoggedIn, userRoles, username }) {
  const [searchTitle, setSearchTitle] = useState("");
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.products.filters);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchTitle = String(searchTitle);
    dispatch(setFilters({ ...filters, title: newSearchTitle }));
    dispatch(fetchFilteredProducts({ ...filters, title: newSearchTitle }));
    navigate("/product-list");
  };

  return (
    <>
      <Navbar expand="xl" bg="dark" variant="dark" className="navigation-bar">
        <Container>
          <Navbar.Brand href={userRoles !== "ADMIN" ? "/" : null}>
            <img
              src="/logo/aptech-logo.avif"
              alt="Book Store logo"
              width="200"
              height="40"
              className="brand-logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {userRoles !== "ADMIN" && (
              <Form className="d-flex search-form" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Enter Title"
                  className="search-input"
                  aria-label="Search"
                  value={searchTitle}
                  onChange={handleSearchChange}
                />
                <Button variant="outline-success" type="submit">
                  <FaSearch />
                </Button>
              </Form>
            )}
            <Nav className="me-auto"></Nav>
            <Nav>
              {isLoggedIn ? (
                <>
                  <div className="icons-container">
                    {userRoles === "USER" && (
                      <>
                        <Nav.Link as={Link} to="/user/wishlist" className="p-0">
                          <HeartFill className="heart-icon" />
                        </Nav.Link>
                        <NotificationsDropdown />
                        <MiniCart />
                      </>
                    )}
                  </div>
                  <div className="user-info">
                    <span className="text-light me-2">{username}</span>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="dark" id="dropdown-user">
                        <FaUser />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userRoles === "USER" && (
                          <>
                            <Dropdown.Item href="/user/profile">
                              <BsPerson className="user-info-icon" /> Profile
                            </Dropdown.Item>
                            <Dropdown.Item href="/user/addresses">
                              <BsHouse className="user-info-icon" /> Addresses
                            </Dropdown.Item>
                            <Dropdown.Item href="/user/change-password">
                              <BsKey className="user-info-icon" /> Change
                              Password
                            </Dropdown.Item>
                            <Dropdown.Item href="/user/order-tracking">
                              <FaShippingFast className="user-info-icon" />{" "}
                              Order Tracking
                            </Dropdown.Item>
                            <Dropdown.Item href="/user/redeem-point">
                              <BsGift className="user-info-icon" /> Redeem Point
                            </Dropdown.Item>
                            <Dropdown.Item href="/user/wallet-coupon">
                              <BsCash className="user-info-icon" /> Wallet
                              Coupon
                            </Dropdown.Item>
                          </>
                        )}
                        <Dropdown.Item onClick={handleLogout}>
                          <LuLogOut className="user-info-icon" /> Log Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
