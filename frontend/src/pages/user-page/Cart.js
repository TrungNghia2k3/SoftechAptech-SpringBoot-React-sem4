import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import QuantityControlCart from "../../components/quantity-control/QuantityControlCart";
import { deleteProductFromCart, updateCartProductQuantities } from "../../features/cart/cartSlice";
import {
  getCartByUserId,
} from "../../services/cartService";
import { formatCurrencyVND } from "../../utilities/Utils";

const Cart = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user.id;

  const [cartProducts, setCartProducts] = useState([]);
  const [selectedProductList, setSelectedProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTotalAmount, setSelectedTotalAmount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCart = useCallback(async () => {
    try {
      const response = await getCartByUserId(userId);
      setCartProducts(response.result.cartProducts);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    setTotalAmount(calculateTotalAmount(cartProducts));
  }, [cartProducts]);

  const calculateTotalAmount = (products) =>
    products.reduce((acc, product) => acc + product.totalPrice, 0);

  const updateSelectedTotalAmount = useCallback(() => {
    const total = cartProducts
      .filter((product) => selectedProductList.includes(product.product.id))
      .reduce((acc, product) => acc + product.totalPrice, 0);
    setSelectedTotalAmount(total);
  }, [cartProducts, selectedProductList]);

  useEffect(() => {
    updateSelectedTotalAmount();
  }, [updateSelectedTotalAmount]);

  const handleQuantityChange = useCallback((cartProductId, newQuantity) => {
    setCartProducts((prevList) =>
      prevList.map((product) =>
        product.id === cartProductId
          ? {
              ...product,
              quantity: newQuantity,
              totalPrice: product.product.price * newQuantity,
            }
          : product
      )
    );
  }, []);

  const handleRemoveProduct = useCallback(
    async (cartProductId, productId) => {
      try {
        await dispatch(deleteProductFromCart({ userId, productId }));
        setCartProducts((prevList) =>
          prevList.filter((product) => product.id !== cartProductId)
        );
        toast.success("Product removed from cart successfully");
      } catch (error) {
        toast.error("Failed to remove product from cart");
      }
    },
    [dispatch, userId]
  );

  const handleCheckout = async () => {
    try {
      const cartProductQuantities = cartProducts.map((product) => ({
        productId: product.product.id,
        quantity: product.quantity,
        totalPrice: product.totalPrice,
      }));

      await dispatch(updateCartProductQuantities({userId: userId, products: cartProductQuantities}));

      const selectedProducts = cartProducts
        .filter((product) => selectedProductList.includes(product.product.id))
        .map((product) => ({
          productId: product.product.id,
          quantity: product.quantity,
          totalPrice: product.totalPrice,
        }));

      navigate("/checkout", {
        state: { products: selectedProducts, totalAmount: selectedTotalAmount },
      });
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleSelectAll = () => {
    setSelectedProductList((prevSelected) =>
      prevSelected.length === cartProducts.length
        ? []
        : cartProducts.map((product) => product.product.id)
    );
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductList((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const cartItems = useMemo(() => {
    return cartProducts.map((cartProduct) => (
      <Card key={cartProduct.id} className="mb-3">
        <Card.Body>
          <Row>
            <Col xs={1} md={1} className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                checked={selectedProductList.includes(cartProduct.product.id)}
                onChange={() => handleSelectProduct(cartProduct.product.id)}
              />
            </Col>
            <Col xs={3} md={2}>
              <Card.Img
                src={cartProduct.product.image_main}
                alt={cartProduct.product.title}
                className="img-fluid"
                style={{ width: "140px", height: "140px", objectFit: "cover" }}
              />
            </Col>
            <Col
              xs={8}
              md={4}
              className="d-flex flex-column justify-content-center"
            >
              <Card.Text>{cartProduct.product.title}</Card.Text>
              <Card.Text>
                Price: {formatCurrencyVND(cartProduct.product.price)}
              </Card.Text>
            </Col>
            <Col
              xs={12}
              md={2}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <QuantityControlCart
                quantity={cartProduct.quantity}
                onIncrease={() =>
                  handleQuantityChange(cartProduct.id, cartProduct.quantity + 1)
                }
                onDecrease={() =>
                  handleQuantityChange(cartProduct.id, cartProduct.quantity - 1)
                }
              />
            </Col>
            <Col
              xs={6}
              md={2}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <Card.Text className="text-danger">
                {formatCurrencyVND(cartProduct.totalPrice)}
              </Card.Text>
            </Col>
            <Col
              xs={6}
              md={1}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  handleRemoveProduct(cartProduct.id, cartProduct.product.id)
                }
              >
                Remove
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  }, [
    cartProducts,
    selectedProductList,
    handleQuantityChange,
    handleRemoveProduct,
  ]);

  return (
    <>
      <h3 className="fw-bold">Shopping Cart</h3>
      <Form.Check
        type="checkbox"
        label="Select All"
        checked={selectedProductList.length === cartProducts.length}
        onChange={handleSelectAll}
        className="mb-3"
      />
      <ListGroup variant="flush">{cartItems}</ListGroup>
      <h4 className="mt-4">
        Total Amount: {formatCurrencyVND(selectedTotalAmount)}
      </h4>
      <Button
        variant="success"
        onClick={handleCheckout}
        disabled={selectedProductList.length === 0}
        className="mt-2"
      >
        Checkout
      </Button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Cart;
