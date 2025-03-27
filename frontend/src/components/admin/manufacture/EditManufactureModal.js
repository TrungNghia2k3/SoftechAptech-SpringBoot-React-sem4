import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditManufactureModal = ({
  show,
  handleClose,
  editedManufacture,
  setEditedManufacture,
  handleEditManufacture,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Update Manufacturer</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formManufactureName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={editedManufacture?.name || ""}
            onChange={(e) =>
                setEditedManufacture({ ...editedManufacture, name: e.target.value })
            }
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleEditManufacture}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditManufactureModal;