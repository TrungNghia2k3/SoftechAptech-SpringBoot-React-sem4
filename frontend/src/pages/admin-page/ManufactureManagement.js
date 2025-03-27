import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import CreateManufactureModal from "../../components/admin/manufacture/CreateManufactureModal";
import DeleteManufactureModal from "../../components/admin/manufacture/DeleteManufactureModal";
import EditManufactureModal from "../../components/admin/manufacture/EditManufactureModal";
import CustomPagination from "../../components/pagination/CustomPagination";
import ViewProductsModal from "../../components/admin/view-products-modal/ViewProductsModal";
import {
  createManufacture,
  deleteManufacture,
  editManufacture,
  getAllPaginationSortManufacture,
} from "../../services/manufactureService";
import { getAllProductsByManufactureId } from "../../services/productService";

const ManufactureManagement = () => {
  const [manufactures, setManufactures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentManufacture, setcurrentManufacture] = useState(null);
  const [editedManufacture, setEditedManufacture] = useState(null);
  const [newManufacture, setNewManufacture] = useState({ name: "" });
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchManufactures(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchManufactures = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllPaginationSortManufacture(
        page,
        10,
        sortBy,
        sortDirection
      );
      setManufactures(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to fetch manufactures");
    }
  };

  const fetchProductsByManufactureId = async (manufactureId) => {
    try {
      const response = await getAllProductsByManufactureId(manufactureId);
      setProducts(response.result);
      setShowProductsModal(true);
    } catch (error) {
      if (error.response.data.code === 1024) {
        toast.info("No products found for this manufacture.");
      } else {
        toast.error("Failed to fetch products");
      }
    }
  };

  const handleCreateManufacture = async () => {
    if (newManufacture.name) {
      try {
        await createManufacture(newManufacture);
        toast.success("Manufacture created successfully");
        handleCloseCreateModal();
        fetchManufactures(currentPage, sortBy, sortDirection);
        setCurrentPage(1);
        setSortDirection("desc");
      } catch (error) {
        handleApiError(error);
      }
    } else {
      toast.error("Please fill in all the required fields");
    }
  };

  const handleEditManufacture = async () => {
    if (editedManufacture) {
      try {
        await editManufacture(editedManufacture.id, editedManufacture);
        toast.success("Manufacture updated successfully");
        handleCloseEditModal();
        fetchManufactures(currentPage, sortBy, sortDirection);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleDeleteManufacture = async () => {
    if (currentManufacture) {
      try {
        await deleteManufacture(currentManufacture.id);
        toast.success("Manufacture deleted successfully");
        handleCloseModal();
        fetchManufactures(currentPage, sortBy, sortDirection);
      } catch (error) {
        toast.error("Failed to delete manufacture");
      }
    }
  };

  const handleSort = (column) => {
    const direction =
      sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);
    fetchManufactures(currentPage, column, direction);
  };

  const handleApiError = (error) => {
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      if (code === 1032 || code === 1033) {
        toast.error(message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewManufacture({ name: "" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setcurrentManufacture(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedManufacture(null);
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setProducts([]);
  };

  return (
    <div className="manufacture-management">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h1 className="fw-bold">Manufactures Management</h1>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          Create
        </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID
                {sortBy === "id" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th onClick={() => handleSort("name")}>
                Name
                {sortBy === "name" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {manufactures.map((manufacture) => (
              <tr key={manufacture.id}>
                <td>{manufacture.id}</td>
                <td>{manufacture.name}</td>
                <td className="actions-column">
                  <Button
                    variant="primary"
                    onClick={() => fetchProductsByManufactureId(manufacture.id)} // Fetch and show products
                    className="me-2"
                  >
                    View Products
                  </Button>

                  <Button
                    variant="warning"
                    onClick={() => {
                      setEditedManufacture(manufacture);
                      setShowEditModal(true);
                    }}
                    className="me-2"
                  >
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <CreateManufactureModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        newManufacture={newManufacture}
        setNewManufacture={setNewManufacture}
        handleCreateManufacture={handleCreateManufacture}
      />
      <DeleteManufactureModal
        show={showModal}
        handleClose={handleCloseModal}
        handleDeleteManufacture={handleDeleteManufacture}
      />
      <EditManufactureModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        editedManufacture={editedManufacture}
        setEditedManufacture={setEditedManufacture}
        handleEditManufacture={handleEditManufacture}
      />

      <ViewProductsModal
        show={showProductsModal}
        onClose={handleCloseProductsModal}
        products={products}
        type={"Manufacture"}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ManufactureManagement;
