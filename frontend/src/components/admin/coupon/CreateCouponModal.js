import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreateCouponModal = ({
  show,
  handleClose,
  newCoupon,
  setNewCoupon,
  handleCreateCoupon,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Create Coupon</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="id">
          <Form.Label>Id</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Enter coupon id"
            value={newCoupon.id}
            onChange={(e) => setNewCoupon({ ...newCoupon, id: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Select
            required
            type="text"
            placeholder="Enter coupon type"
            value={newCoupon.type}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, type: e.target.value })
            }
          >
            <option>Open this select menu</option>
            <option value="AMOUNT">AMOUNT</option>
            <option value="PERCENTAGE">PERCENTAGE</option>
            <option value="FREESHIP">FREESHIP</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="value">
          <Form.Label>Value</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter coupon value"
            value={newCoupon.value}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, value: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter coupon description"
            value={newCoupon.description}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, description: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="pointCost">
          <Form.Label>Point Cost</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter coupon point cost"
            value={newCoupon.pointCost}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, pointCost: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="minOrderValue">
          <Form.Label>Min Order Value</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter min oder value"
            value={newCoupon.minOrderValue}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })
            }
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleCreateCoupon}>
        Create
      </Button>
    </Modal.Footer>
  </Modal>
);

export default CreateCouponModal;
