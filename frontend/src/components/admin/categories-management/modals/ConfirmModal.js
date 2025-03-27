import PropTypes from "prop-types";
import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmModal = ({ show, handleClose, handleConfirm, title, body }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default ConfirmModal;
