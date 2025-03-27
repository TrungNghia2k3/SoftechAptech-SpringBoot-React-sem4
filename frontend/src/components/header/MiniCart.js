import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Badge, Card, Button } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { fetchCartByUserId } from "../../features/cart/cartSlice";
import "./MiniCart.scss"; // Updated import to use SCSS file
import { Link } from "react-router-dom";
import { formatCurrencyVND } from "../../utilities/Utils";

const MiniCart = () => {
  const dispatch = useDispatch();
  const { items, totalItemCount, totalPrice } = useSelector(
    (state) => state.cart
  );

  // console.log(items, totalItemCount, totalPrice);

  const cartProducts = items?.cartProducts ?? [];
  const itemCount = totalItemCount ?? 0;
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartByUserId(userId));
    }
  }, [dispatch, userId]);

  return (
    <Dropdown align="end" className="mini-cart">
      <Dropdown.Toggle variant="dark" id="dropdown-cart">
        <FaShoppingCart />
        {itemCount > 0 && (
          <Badge pill bg="danger" className="cart-badge">
            {itemCount}
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {cartProducts.length === 0 ? (
          <Dropdown.Item>No items in cart</Dropdown.Item>
        ) : (
          cartProducts.map((item, index) => (
            <Dropdown.Item key={index} className="cart-item">
              <Link
                to={`/product/${item.product.id}`}
                className="text-decoration-none"
              >
                <Card className="d-flex flex-row align-items-center cart-item-card">
                  <Card.Img
                    variant="left"
                    src={item.product.image_main}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <Card.Title className="cart-item-title">
                      {item.product.title}
                    </Card.Title>
                    <Card.Text className="cart-item-quantity">
                      x{item.quantity}
                    </Card.Text>
                    <Card.Text className="cart-item-price">
                      {formatCurrencyVND(item.product.price)}
                    </Card.Text>
                  </div>
                </Card>
              </Link>
            </Dropdown.Item>
          ))
        )}
        <Button href="/user/cart" variant="primary" className="view-cart-button">
          View Cart
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MiniCart;
