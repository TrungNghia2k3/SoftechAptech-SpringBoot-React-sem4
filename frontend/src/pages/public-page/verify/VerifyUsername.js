import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { forgotPassword } from "../../../services/userService";
import "./verifyUsername.scss"; // Import the styles

const VerifyUsername = () => {
  const [username, setUsername] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword(username);
      if (response.data.code === 1000) {
        toast.success(response.data.message);
        setIsDisabled(true);
      }
    } catch (error) {
      if (error.response.data.code === 1005) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Email not found. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="verify-username-container">
        <Card className="verify-username-card">
          <Card.Body>
            <Card.Title className="verify-username-title">
              <h5>Forgot Password</h5>
            </Card.Title>
            <Form onSubmit={handleUsernameSubmit}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="submit-btn"
                disabled={isDisabled}
              >
                Submit
              </Button>

              <Button variant="secondary" href="/" className="submit-btn ms-2">
                Close
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default VerifyUsername;
