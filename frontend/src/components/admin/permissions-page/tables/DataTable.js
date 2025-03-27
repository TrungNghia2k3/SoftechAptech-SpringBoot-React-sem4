import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deletePermission } from "../../../../services/permissionsService";
import ConfirmModal from "../modals/ConfirmModal";
import ModalForm from "../modals/ModalForm";

function DataTable({ items, updateState, deleteItemFromState }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = async () => {
    try {
      await deletePermission(selectedItem);
      deleteItemFromState(selectedItem);
      toast.success("Permission deleted successfully");
      setShowConfirm(false);
    } catch (error) {
      const errorResponse = error.response
        ? error.response.data
        : error.message;
      toast.error(errorResponse.message || "Failed to delete permission");
      setShowConfirm(false);
    }
  };

  const handleShowConfirm = (name) => {
    setSelectedItem(name);
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setSelectedItem(null);
  };

  return (
    <>
      <ConfirmModal
        show={showConfirm}
        handleClose={handleCloseConfirm}
        handleConfirm={handleDelete}
        title="Delete Permission"
        body="Are you sure you want to delete this permission?"
      />
      <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                <div className="d-flex">
                  <ModalForm
                    buttonLabel="Edit"
                    item={item}
                    updateState={updateState}
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleShowConfirm(item.name)}
                    className="ms-2"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default DataTable;
