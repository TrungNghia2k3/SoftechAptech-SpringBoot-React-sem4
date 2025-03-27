import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreatePublisherModal = ({
  show,
  handleClose,
  newPublisher,
  setNewPublisher,
  handleCreatePublisher,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Create Publisher</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Enter publisher name"
            value={newPublisher.name}
            onChange={(e) =>
              setNewPublisher({ ...newPublisher, name: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter publisher code"
            value={newPublisher.code}
            onChange={(e) =>
              setNewPublisher({ ...newPublisher, code: e.target.value })
            }
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleCreatePublisher}>
        Create
      </Button>
    </Modal.Footer>
  </Modal>
);

export default CreatePublisherModal;
