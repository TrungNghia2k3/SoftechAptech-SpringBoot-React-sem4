import React, { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import OtpInput from "../../../components/otp-input/OtpInput";
import { regenerateOtp, verifyAccount } from "../../../services/userService";
import "./verifyUser.scss"; // Import the styles

const VerifyUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [showUsernameForm, setShowUsernameForm] = useState(
    !location.state || !location.state.username
  );
  const [username, setUsername] = useState(location.state?.username || "");
  const [showResendButton, setShowResendButton] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown in seconds

  useEffect(() => {
    if (!showUsernameForm) {
      startCountdown();
    }
  }, [showUsernameForm]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setShowResendButton(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = () => {
    setShowResendButton(false);
    setCountdown(120); // Reset countdown to 2 minutes
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyAccount(username, otp);
      if (response.data.code === 1000) {
        toast.success("Verified account successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // 3000 milliseconds = 3 seconds
      }
    } catch (error) {
      if (error.response.data.code === 1017) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1015) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Verify user failed. Please try again.");
      }
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    startCountdown();

    try {
      const response = await regenerateOtp(username);
      if (response.data.code === 1000) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response.data.code === 1005) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Verify user failed. Please try again.");
      }
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await regenerateOtp(username);
      if (response.data.code === 1000) {
        toast.success(response.data.message);
        setShowUsernameForm(false);
        startCountdown();
      }
    } catch (error) {
      if (error.response.data.code === 1005) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Verify user failed. Please try again.");
      }
    }
  };

  return (
    <>
      <Modal
        show={showUsernameForm}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Enter Your Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUsernameSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="mt-2" variant="primary" type="submit">
              Submit
            </Button>
            <Button className="mt-2 ms-2" href="/" variant="secondary">
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="verify-user-container">
        <Card className="verify-user-card">
          <h5 className="verify-user-header">Please check your email</h5>
          <p className="verify-user-info">
            {showUsernameForm
              ? "Please enter your username to continue."
              : `We've sent a code to ${username}.`}
          </p>
          {!showUsernameForm && (
            <>
              <OtpInput
                numInputs={6}
                value={otp}
                onChange={setOtp}
                inputStyle="otp-input"
              />
              <Button
                variant="primary"
                onClick={handleVerify}
                className="verify-btn"
                disabled={otp.length !== 6}
              >
                Verify OTP
              </Button>
              <Button
                variant="link"
                onClick={handleResendOTP}
                className="resend-btn"
                disabled={!showResendButton}
              >
                Resend OTP ({countdown} seconds)
              </Button>
            </>
          )}
        </Card>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default VerifyUser;
