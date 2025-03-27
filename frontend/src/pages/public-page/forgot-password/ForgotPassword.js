import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { resetPassword } from "../../../services/userService";
import "./forgot-password.scss"; // Import the styles

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("username");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword(username, newPassword);
      if (response.data.code === 1000) {
        toast.success(response.data.message);
        navigate("/login"); // Navigate back to login page
      }
    } catch (error) {
      if (error.response?.data?.code === 1005) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1001) {
        toast.error(error.response.data.errors.newPassword);
      } else {
        toast.error("Password reset failed. Please try again.");
      }

      console.log(error);
    }
  };

  return (
    <>
      <div className="forgot-password-container">
        <Card className="forgot-password-card">
          <Card.Body>
            <Card.Title>
              <h5>Forgot Password</h5>
            </Card.Title>
            <Form onSubmit={handlePasswordReset}>
              <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={newPasswordVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <InputGroup.Text
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  >
                    {newPasswordVisible ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <InputGroup.Text
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Reset Password
              </Button>
              <Button className="mt-3 ms-2" href="/" variant="secondary">
                Close
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default ForgotPassword;
