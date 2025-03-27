import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const CategoryForm = ({
  category,
  onSave,
  onImageChange,
  onNameChange,
  onCodeChange,
  onClose,
}) => {
  const [imagePreview, setImagePreview] = useState(category.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={category.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Code</Form.Label>
        <Form.Control
          type="text"
          value={category.code}
          onChange={(e) => onCodeChange(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>

      {imagePreview && (
        <div className="mb-3">
          <img src={imagePreview} alt="Preview" width="100px" height="100px" />
        </div>
      )}

      <Button variant="primary" onClick={onSave}>
        Save Changes
      </Button>
      <Button variant="secondary" onClick={onClose} className="ms-2">
        Close
      </Button>
    </Form>
  );
};

export default CategoryForm;
