import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeletePublisherModal = ({ show, handleClose, handleDeletePublisher }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Delete Publisher</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete this publisher?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDeletePublisher}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeletePublisherModal;
