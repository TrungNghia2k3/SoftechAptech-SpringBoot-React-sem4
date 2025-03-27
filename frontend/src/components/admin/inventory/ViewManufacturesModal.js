import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { formatCurrencyVND } from "../../../utilities/Utils";
import "./ViewManufacturesModal.scss"; // Import CSS for styling

const ViewManufacturesModal = ({
  show,
  onClose,
  productManufactures,
  onEdit,
  onDelete,
}) => {
  const clearModal = () => {
    // Clear any specific state if needed (e.g., productManufactures)
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        clearModal();
        onClose();
      }}
      dialogClassName="modal-90w" // Optional: Adjust modal width
      aria-labelledby="example-custom-modal-styling-title"
      className="view-manufactures-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          List of manufacturers
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {productManufactures.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Manufacture Name</th>
                <th>Quantity</th>
                <th>Price of Units</th>
                <th>Entry Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productManufactures.map((manufacture) => (
                <tr>
                  <td>{manufacture.manufactureName}</td>
                  <td>{manufacture.quantity}</td>
                  <td>{formatCurrencyVND(manufacture.priceOfUnits)}</td>
                  <td>{manufacture.entryDate}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        onEdit(manufacture.id);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      className="ms-1"
                      variant="danger"
                      onClick={() => onDelete(manufacture.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No manufactures found for this product.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            clearModal();
            onClose();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewManufacturesModal;
