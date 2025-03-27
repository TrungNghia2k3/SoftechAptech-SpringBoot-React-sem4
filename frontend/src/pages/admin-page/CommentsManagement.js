import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import {
  getAllComments,
  getCommentById,
  addAdminResponse,
} from "../../services/commentService"; // Import các API
import StarRatings from "react-star-ratings";
import { formatNotificationDate } from "../../utilities/Utils";
import { toast, ToastContainer } from "react-toastify";
import CustomPagination from "../../components/pagination/CustomPagination";

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  // Fetch all comments on component mount
  useEffect(() => {
    fetchComments(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchComments = async (page, sortBy, sortDirection) => {
    try {
      const data = await getAllComments(page, 10, sortBy, sortDirection);
      setComments(data.result.content);
      setTotalPages(data.result.totalPages);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  // Function to handle clicking "View Detail"
  const handleViewDetail = async (id) => {
    try {
      const response = await getCommentById(id);
      setSelectedComment(response.result);
      setAdminResponse(response.result.adminResponse || ""); // Populate existing response if available
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error("Failed to fetch comment by id", error);
    }
  };

  // Handle submitting admin response
  const handleAdminResponseSubmit = async () => {
    try {
      console.log(selectedComment.id, { adminResponse });
      await addAdminResponse(selectedComment.id, { adminResponse });
      toast.success("Successfully responded to comment");
      setCurrentPage(1);
      setShowModal(false); // Close the modal
      fetchComments(); // Refresh the comments list
    } catch (error) {
      console.error("Failed to add admin response", error);
    }
  };

  return (
    <>
      <h1 className="fw-bold">Comments Management</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Content</th>
            <th>Stars</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.user.username}</td>
              <td>{comment.content}</td>
              <td>
                <StarRatings
                  rating={comment.stars}
                  starRatedColor="gold"
                  starEmptyColor="gray"
                  starDimension="16px"
                  starSpacing="2px"
                  numberOfStars={5}
                  isSelectable={false} // Không cho chỉnh sửa
                />
              </td>
              <td>
                <Button onClick={() => handleViewDetail(comment.id)}>
                  View Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal for viewing comment detail and adding admin response */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comment Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComment && (
            <>
              <p>
                <strong>User:</strong> {selectedComment.user.username}
              </p>
              <p>
                <strong>Product:</strong> {selectedComment.product.title}
              </p>
              <p>
                <strong>Content:</strong> {selectedComment.content}
              </p>
              <p>
                <div className="d-flex justify-content-start">
                  <strong
                    style={{
                      marginTop: "2px",
                    }}
                  >
                    Stars:
                  </strong>
                  <div className="ms-2">
                    <StarRatings
                      rating={selectedComment.stars}
                      starRatedColor="gold"
                      starEmptyColor="gray"
                      starDimension="16px"
                      starSpacing="2px"
                      numberOfStars={5}
                      isSelectable={false} // Không cho chỉnh sửa
                    />
                  </div>
                </div>
              </p>
              <p>
                <strong>Created Date:</strong>{" "}
                {formatNotificationDate(selectedComment.createdDate)}
              </p>

              <Form.Group controlId="adminResponse">
                <Form.Label>
                  <strong>Reponse of Admin: </strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdminResponseSubmit}>
            Submit Response
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default CommentsManagement;
