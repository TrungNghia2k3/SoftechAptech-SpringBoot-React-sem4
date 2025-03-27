import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Import the icons
import { ToastContainer, toast } from "react-toastify";
import { changePassword } from "../../services/userService"; // Adjust the import path as needed

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (oldPassword === newPassword) {
      toast.error("The new password cannot be the same as the current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      if (error.response.data.code === 1043) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(validationErrors[key]);
        }
      } else {
        toast.error("Failed to change password");
      }
    }
  };

  return (
    <>
      <h3 className="fw-bold">Change Password</h3>
      <Card>
        <Card.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group controlId="oldPassword">
              <Form.Label>Current Password</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="ms-2"
                >
                  {showOldPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </div>
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="ms-2"
                >
                  {showNewPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </div>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ms-2"
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </div>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Change Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default ChangePassword;
