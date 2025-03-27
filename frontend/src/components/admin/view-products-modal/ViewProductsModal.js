import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import "./ViewProductsModal.scss"

const ViewProductsModal = ({ show, onClose, products, type }) => (
  <Modal show={show} onHide={onClose} size="lg" centered>
    <Modal.Header closeButton>
      <Modal.Title>Products in {type}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {products.length === 0 ? (
        <p>No products found for this {type.toLowerCase()}.</p>
      ) : (
        <div className="view-products-table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.author}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ViewProductsModal;
