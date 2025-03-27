import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { getManufactureProductById } from "../../../services/manufactureProductsService";

const DeleteConfirmationModal = ({
  show,
  onClose,
  onDeleteConfirm,
  manufactureId,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(0);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (manufactureId && show) {
      console.log(manufactureId);
      // Fetch manufacture data by id when the modal opens
      getManufactureProductById(manufactureId).then((data) => {
        setQuantity(data.result.quantity);
        setInStock(data.result.product.inStock);
        setProductId(data.result.product.id);
      });
    }
  }, [manufactureId, show]);

  const handleDeleteConfirm = () => {
    onDeleteConfirm({
      id: manufactureId,
      quantity,
      inStock,
      productId,
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
