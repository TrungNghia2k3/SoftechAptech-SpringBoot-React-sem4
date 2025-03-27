import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteManufactureModal = ({ show, handleClose, handleDeleteManufacture }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Delete Manufacturer</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete this manufacturer?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDeleteManufacture}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteManufactureModal;