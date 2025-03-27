import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreateManufactureModal = ({
    show,
    handleClose,
    newManufacture,
    setNewManufacture,
    handleCreateManufacture,
  }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Manufacturer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter manufacture name"
              value={newManufacture.name}
              onChange={(e) =>
                setNewManufacture({ ...newManufacture, name: e.target.value })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreateManufacture}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
  
  export default CreateManufactureModal;