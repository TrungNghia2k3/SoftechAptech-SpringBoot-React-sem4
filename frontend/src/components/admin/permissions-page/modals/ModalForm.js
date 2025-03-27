import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AddEditForm from "../forms/AddEditForm";
import PropTypes from "prop-types";

function ModalForm({
  buttonLabel,
  addItemToState,
  updateState,
  item,
  className,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isEdit = buttonLabel === "Edit";
  const buttonVariant = isEdit ? "warning" : "success";
  const title = isEdit ? "Edit Permission" : "Add Permission";

  return (
    <div>
      <Button
        variant={buttonVariant}
        onClick={handleShow}
        className="me-2"
      >
        {buttonLabel}
      </Button>
      <Modal show={show} onHide={handleClose} className={className}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEditForm
            addItemToState={addItemToState}
            updateState={updateState}
            item={item}
            handleClose={handleClose} // Pass handleClose to close modal on form submit
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

ModalForm.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  addItemToState: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  item: PropTypes.object,
  className: PropTypes.string,
};

export default ModalForm;
