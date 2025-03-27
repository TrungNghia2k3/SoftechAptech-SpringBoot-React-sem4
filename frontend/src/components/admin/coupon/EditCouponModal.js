import React from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Thêm import này

const EditCouponModal = ({
  show,
  handleClose,
  editedCoupon,
  setEditedCoupon,
  handleEditCoupon,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Coupon</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formCouponId">
          <Form.Label>Id</Form.Label>
          <Form.Control
            type="text"
            value={editedCoupon?.id || ""}
            onChange={(e) =>
              setEditedCoupon({ ...editedCoupon, id: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formCouponType">
          <Form.Label>Type</Form.Label>
          <Form.Select
            type="text"
            value={editedCoupon?.type || ""}
            onChange={(e) =>
              setEditedCoupon({ ...editedCoupon, type: e.target.value })
            }
          >
            <option>Open this select menu</option>
            <option value="AMOUNT">AMOUNT</option>
            <option value="PERCENTAGE">PERCENTAGE</option>
            <option value="FREESHIP">FREESHIP</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formCouponValue">
          <Form.Label>Value</Form.Label>
          <Form.Control
            type="text"
            value={editedCoupon?.value || ""}
            onChange={(e) =>
              setEditedCoupon({ ...editedCoupon, value: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formCouponDescription">
          {" "}
          {/* Đã sửa */}
          <Form.Label>Description</Form.Label> {/* Đã sửa */}
          <Form.Control
            type="text"
            value={editedCoupon?.description || ""}
            onChange={(e) =>
              setEditedCoupon({ ...editedCoupon, description: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formCouponPointCost">
          <Form.Label>Point Cost</Form.Label> {/* Đã sửa */}
          <Form.Control
            type="text"
            value={editedCoupon?.pointCost || ""}
            onChange={(e) =>
              setEditedCoupon({ ...editedCoupon, pointCost: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formMinOrderValue">
          <Form.Label>Min Order Value</Form.Label> {/* Đã sửa */}
          <Form.Control
            type="text"
            value={editedCoupon?.minOrderValue || ""}
            onChange={(e) =>
              setEditedCoupon({
                ...editedCoupon,
                minOrderValue: e.target.value,
              })
            }
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleEditCoupon}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditCouponModal;
