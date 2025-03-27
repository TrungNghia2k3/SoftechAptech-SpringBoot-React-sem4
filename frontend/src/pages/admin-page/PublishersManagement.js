import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import CreatePublisherModal from "../../components/admin/publisher/CreatePublisherModal";
import DeletePublisherModal from "../../components/admin/publisher/DeletePublisherModal";
import EditPublisherModal from "../../components/admin/publisher/EditPublisherModal";
import CustomPagination from "../../components/pagination/CustomPagination";
import ViewProductsModal from "../../components/admin/view-products-modal/ViewProductsModal";
import {
  createPublisher,
  deletePublisher,
  editPublisher,
  getAllPaginationSortPublishers,
  toggleDisablePublisher,
} from "../../services/publisherService";
import { getAllProductsByPublisherId } from "../../services/productService";

const PublishersManagement = () => {
  const [publishers, setPublishers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const [editedPublisher, setEditedPublisher] = useState(null);
  const [newPublisher, setNewPublisher] = useState({ name: "", code: "" });

  const [showProductsModal, setShowProductsModal] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPublishers(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchPublishers = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllPaginationSortPublishers(
        page,
        10,
        sortBy,
        sortDirection
      );
      setPublishers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to fetch publishers");
    }
  };

  const fetchProductsByPublisherId = async (publisherId) => {
    try {
      const response = await getAllProductsByPublisherId(publisherId);
      setProducts(response.result);
      setShowProductsModal(true);
    } catch (error) {
      if (error.response.data.code === 1024) {
        toast.info("No products found for this publisher.");
      } else {
        toast.error("Failed to fetch products");
      }
    }
  };

  const handleCreatePublisher = async () => {
    if (newPublisher.name && newPublisher.code) {
      try {
        await createPublisher(newPublisher);
        toast.success("Publisher created successfully");
        handleCloseCreateModal();
        fetchPublishers(currentPage, sortBy, sortDirection);
        setCurrentPage(1);
        setSortDirection("desc");
      } catch (error) {
        handleApiError(error);
      }
    } else {
      toast.error("Please fill in all the required fields");
    }
  };

  const handleDeletePublisher = async () => {
    if (currentPublisher) {
      try {
        await deletePublisher(currentPublisher.id);
        toast.success("Publisher deleted successfully");
        handleCloseModal();
        fetchPublishers(currentPage, sortBy, sortDirection);
      } catch (error) {
        if (error.response.data.code === 1035) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to delete publisher");
        }
      }
    }
  };

  const handleEditPublisher = async () => {
    if (editedPublisher) {
      try {
        await editPublisher(editedPublisher.id, editedPublisher);
        toast.success("Publisher updated successfully");
        handleCloseEditModal();
        fetchPublishers(currentPage, sortBy, sortDirection);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleToggleDisable = async (publisher) => {
    try {
      await toggleDisablePublisher(publisher.id);
      toast.success(
        `Publisher ${publisher.disabled ? "enabled" : "disabled"} successfully`
      );
      fetchPublishers(currentPage, sortBy, sortDirection);
    } catch (error) {
      toast.error("Failed to toggle publisher status");
    }
  };

  const handleSort = (column) => {
    const direction =
      sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);
    fetchPublishers(currentPage, column, direction);
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
    setNewPublisher({ name: "", code: "" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPublisher(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedPublisher(null);
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setProducts([]);
  };

  return (
    <div className="publishers-management">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h1 className="fw-bold">Publishers Management</h1>
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
              <th onClick={() => handleSort("code")}>
                Code
                {sortBy === "code" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher) => (
              <tr key={publisher.id}>
                <td>{publisher.id}</td>
                <td>{publisher.name}</td>
                <td>{publisher.code}</td>
                <td>
                  <Form>
                    <Form.Check
                      type="switch"
                      id={`custom-switch-${publisher.id}`} // Unique ID for each switch
                      checked={!publisher.disabled} // Switch is on when publisher is not disabled
                      onChange={() => handleToggleDisable(publisher)} // Handle the toggle action
                    />
                  </Form>
                </td>

                <td className="actions-column">
                  <Button
                    variant="primary"
                    onClick={() => fetchProductsByPublisherId(publisher.id)} // Fetch and show products
                    className="me-2"
                  >
                    View Products
                  </Button>

                  <Button
                    variant="warning"
                    onClick={() => {
                      setEditedPublisher(publisher);
                      setShowEditModal(true);
                    }}
                    className="me-2"
                  >
                    Update
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      setCurrentPublisher(publisher);
                      setShowModal(true);
                    }}
                  >
                    Delete
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
      <CreatePublisherModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        newPublisher={newPublisher}
        setNewPublisher={setNewPublisher}
        handleCreatePublisher={handleCreatePublisher}
      />
      <DeletePublisherModal
        show={showModal}
        handleClose={handleCloseModal}
        handleDeletePublisher={handleDeletePublisher}
      />
      <EditPublisherModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        editedPublisher={editedPublisher}
        setEditedPublisher={setEditedPublisher}
        handleEditPublisher={handleEditPublisher}
      />

      <ViewProductsModal
        show={showProductsModal}
        onClose={handleCloseProductsModal}
        products={products}
        type={"Publisher"}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default PublishersManagement;
