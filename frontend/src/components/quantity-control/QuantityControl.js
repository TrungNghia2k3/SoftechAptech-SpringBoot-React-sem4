import React from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { Plus, Dash } from "react-bootstrap-icons";

const QuantityControl = ({ quantity, setQuantity }) => {
  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <InputGroup className="mb-3" style={{ maxWidth: "200px" }}>
      <Button variant="outline-secondary" onClick={handleDecrease}>
        <Dash />
      </Button>
      <FormControl
        type="text"
        value={quantity}
        readOnly
        className="text-center"
      />
      <Button variant="outline-secondary" onClick={handleIncrease}>
        <Plus />
      </Button>
    </InputGroup>
  );
};

export default QuantityControl;
