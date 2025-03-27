import React from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteCouponModal = ({ show, handleClose, handleDeleteCoupon }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Coupon</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this coupon?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteCoupon}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );

export default DeleteCouponModal