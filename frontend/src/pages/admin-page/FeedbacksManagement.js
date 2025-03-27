import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import CustomPagination from "../../components/pagination/CustomPagination";
import {
  deleteFeedback,
  getAllPaginationSortFeedbacks,
} from "../../services/feedbackService";

const FeedbacksManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentFeedback, setCurrentFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchFeedbacks = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllPaginationSortFeedbacks(
        page,
        10,
        sortBy,
        sortDirection
      );
      setFeedbacks(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
    }
  };

  const handleDeleteModal = (feedback) => {
    setCurrentFeedback(feedback);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentFeedback(null);
  };

  const handleDeleteFeedback = async () => {
    try {
      if (currentFeedback) {
        await deleteFeedback(currentFeedback.id);
        toast.success("Feedback deleted successfully");
        handleCloseModal();
        fetchFeedbacks(currentPage, sortBy, sortDirection);
      }
    } catch (error) {
      toast.error("Failed to delete feedback");
    }
  };

  const handleSort = (column) => {
    const direction =
      sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);
  };

  return (
    <>
      <h1 className="fw-bold">Feedbacks Management</h1>
      <div className="table-responsive mt-3">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer", width: "50px" }}
              >
                #
                {sortBy === "id" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  ></i>
                )}
              </th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer", width: "150px" }}
              >
                Name
                {sortBy === "name" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  ></i>
                )}
              </th>
              <th
                onClick={() => handleSort("email")}
                style={{ cursor: "pointer", width: "200px" }}
              >
                Email
                {sortBy === "email" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  ></i>
                )}
              </th>
              <th
                onClick={() => handleSort("subject")}
                style={{ cursor: "pointer", width: "200px" }}
              >
                Subject
                {sortBy === "subject" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  ></i>
                )}
              </th>
              <th
                onClick={() => handleSort("message")}
                style={{ cursor: "pointer", width: "300px" }}
              >
                Message
                {sortBy === "message" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  ></i>
                )}
              </th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.subject}</td>
                <td>{feedback.message}</td>
                <td>
                  <Button
                    className="ms-2 btn-sm"
                    variant="danger"
                    onClick={() => handleDeleteModal(feedback)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Delete Feedback */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this feedback?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteFeedback}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default FeedbacksManagement;
