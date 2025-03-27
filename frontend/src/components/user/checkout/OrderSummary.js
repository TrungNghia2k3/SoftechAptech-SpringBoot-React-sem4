import React from "react";
import { Button, Card } from "react-bootstrap";
import { formatCurrencyVND } from "../../../utilities/Utils";

const OrderSummary = ({
  productDetails,
  products,
  productTotal,
  fee,
  totalPayment,
  onOrderConfirmation,
}) => (
  <div className="mt-3">
    <Card>
      <Card.Body>
        <h5>ORDER SUMMARY</h5>
        {productDetails.map((product, index) => (
          <div key={index} className="d-flex align-items-center my-3">
            <img
              loading="lazy"
              src={product.result.image_main}
              alt={product.result.title}
              className="card-img"
              style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />
            <div className="ml-2">
              <h5 className="mt-0">{product.result.title}</h5>
              <p className="m-0">Quantity: {products[index].quantity}</p>
              <p className="m-0">
                Price: {formatCurrencyVND(product.result.price)}
              </p>
              <p className="text-danger fw-bold m-0">
                Total price:{" "}
                {products[index].totalPrice !== null &&
                products[index].totalPrice !== undefined
                  ? `₫ ${products[index].totalPrice.toLocaleString("vi-VN")}`
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
        
        <hr />

        <p>
          Subtotal:{" "}
          {productTotal !== null && productTotal !== undefined
            ? `₫ ${productTotal.toLocaleString("vi-VN")}`
            : "N/A"}
        </p>
        <p>
          Shipping:{" "}
          {fee !== null && fee !== undefined
            ? `₫ ${fee.toLocaleString("vi-VN")}`
            : "N/A"}
        </p>
        <h5 className="text-danger fw-bold">
          Grand Total: {formatCurrencyVND(totalPayment)}
        </h5>
        <Button
          variant="primary"
          className="mt-3"
          onClick={onOrderConfirmation}
        >
          Confirm Order
        </Button>
      </Card.Body>
    </Card>
  </div>
);

export default OrderSummary;
