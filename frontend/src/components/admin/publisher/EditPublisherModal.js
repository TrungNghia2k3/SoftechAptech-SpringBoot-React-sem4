import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditPublisherModal = ({
  show,
  handleClose,
  editedPublisher,
  setEditedPublisher,
  handleEditPublisher,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Publisher</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formPublisherName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={editedPublisher?.name || ""}
            onChange={(e) =>
              setEditedPublisher({ ...editedPublisher, name: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formPublisherCode">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            value={editedPublisher?.code || ""}
            onChange={(e) =>
              setEditedPublisher({ ...editedPublisher, code: e.target.value })
            }
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleEditPublisher}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditPublisherModal;
