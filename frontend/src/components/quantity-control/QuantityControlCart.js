import React from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { Plus, Dash } from "react-bootstrap-icons";

const QuantityControlCart = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <InputGroup className="mb-3" style={{ maxWidth: "200px" , marginTop: "12px"}}>
      <Button
        variant="outline-secondary"
        onClick={onDecrease}
        disabled={quantity <= 1} // Disable if quantity is 1 or less
      >
        <Dash />
      </Button>
      <FormControl
        type="text"
        value={quantity}
        readOnly
        className="text-center"
      />
      <Button variant="outline-secondary" onClick={onIncrease}>
        <Plus />
      </Button>
    </InputGroup>
  );
};

export default QuantityControlCart;
