import React from "react";
import { Modal } from "react-bootstrap";
import CategoryForm from "../forms/CategoryForm";

const CategoryModal = ({
  showModal,
  onClose,
  onSave,
  category,
  onImageChange,
  onNameChange,
  onCodeChange,
  image,
}) => {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {category.id ? "Edit Category" : "Create Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryForm
          category={category}
          onSave={onSave}
          onImageChange={onImageChange}
          onNameChange={onNameChange}
          onCodeChange={onCodeChange}
          onClose={onClose}
        />
      </Modal.Body>
    </Modal>
  );
};

export default CategoryModal;
