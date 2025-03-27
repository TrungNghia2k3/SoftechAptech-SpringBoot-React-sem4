import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ImportProductModal = ({
  show,
  onClose,
  manufactures,
  selectedManufacture,
  setSelectedManufacture,
  quantity,
  setQuantity,
  priceOfUnits,
  setPriceOfUnits,
  onImport,
}) => {
  const clearModal = () => {
    setSelectedManufacture("");
    setQuantity(1);
    setPriceOfUnits(0);
  };

  // Disable Import button if fields are not valid
  const isImportDisabled =
    !selectedManufacture || quantity <= 0 || priceOfUnits <= 0;

  return (
    <Modal
      show={show}
      onHide={() => {
        clearModal();
        onClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Import Product</Modal.Title>
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
        <Button
          variant="primary"
          onClick={onImport}
          disabled={isImportDisabled} // Disable if input is not valid
        >
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportProductModal;
