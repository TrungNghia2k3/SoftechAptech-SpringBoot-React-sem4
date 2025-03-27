import React from "react";
import { Button, Form, Table } from "react-bootstrap";

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  onToggleDisable,
  onViewProductsModal,
}) => (
  <Table striped bordered responsive hover className="mt-3 table-responsive">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Code</th>
        <th>Image</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td>{category.name}</td>
          <td>{category.code}</td>
          <td>
            <img
              src={category.image}
              alt={category.name}
              className="img-fluid" // Ensures image is responsive
              style={{ maxWidth: "100px", maxHeight: "100px" }} // Limits the image size
            />
          </td>
          <td>
            <td>
              <Form>
                <Form.Check
                  type="switch"
                  id={`custom-switch-${category.id}`} // Unique ID for each switch
                  checked={!category.disabled} // Switch is on when category is not disabled
                  onChange={() => onToggleDisable(category)} // Handle the toggle action
                />
              </Form>
            </td>
          </td>
          <td>
            <Button
              variant="primary"
              onClick={() => onViewProductsModal(category.id)}
              className="me-1"
            >
              View Products
            </Button>
            <Button variant="warning" onClick={() => onEdit(category)}>
              Update
            </Button>
            <Button
              className="ms-1"
              variant="danger"
              onClick={() => onDelete(category.id)}
            >
              Delete
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default CategoryTable;
