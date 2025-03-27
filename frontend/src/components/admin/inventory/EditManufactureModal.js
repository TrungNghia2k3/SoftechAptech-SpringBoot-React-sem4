import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getManufactureProductById } from "../../../services/manufactureProductsService";

const EditManufactureModal = ({
  show,
  manufactures,
  onClose,
  manufactureId,
  onUpdate,
}) => {
  const [selectedManufacture, setSelectedManufacture] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceOfUnits, setPriceOfUnits] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [productId, setProductId] = useState("");
  const [oldQuantity, setOldQuantity] = useState(0);

  useEffect(() => {
    if (manufactureId && show) {
      console.log(manufactureId);
      // Fetch manufacture data by id when the modal opens
      getManufactureProductById(manufactureId).then((data) => {
        setSelectedManufacture(data.result.manufacture.id);
        setQuantity(data.result.quantity);
        setPriceOfUnits(data.result.priceOfUnits);
        setInStock(data.result.product.inStock);
        setProductId(data.result.product.id);
        setOldQuantity(data.result.quantity);
      });
    }
  }, [manufactureId, show]);

  const clearModal = () => {
    setSelectedManufacture("");
    setQuantity(1);
    setPriceOfUnits(0);
  };

  const handleUpdate = () => {
    onUpdate({
      id: manufactureId,
      selectedManufacture,
      quantity,
      oldQuantity,
      priceOfUnits,
      inStock,
      productId,
    });
    clearModal();
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        clearModal();
        onClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Manufacture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Manufacture</Form.Label>
            <Form.Select
              value={selectedManufacture}
              onChange={(e) => setSelectedManufacture(e.target.value)}
            >
              <option value="">Select a Manufacture</option>
              {manufactures.map((manufacture) => (
                <option key={manufacture.id} value={manufacture.id}>
                  {manufacture.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price of Units</Form.Label>
            <Form.Control
              type="number"
              value={priceOfUnits}
              onChange={(e) => setPriceOfUnits(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            clearModal();
            onClose();
          }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditManufactureModal;
