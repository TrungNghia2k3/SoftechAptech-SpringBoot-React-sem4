import React, { useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { createUser, regenerateOtp } from "../../../services/userService";
import "./register.scss";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await createUser(
        username,
        password,
        firstName,
        lastName,
        dob,
        phone
      );

      console.log(response);

      if (response.data.code === 1000) {
        toast.success(
          "Registered information successfully, please authenticate via email to access the application"
        );

        // Delay 3 giây trước khi điều hướng
        setTimeout(() => {
          navigate("/verify-user", { state: { username } });
        }, 3000); // 3000 milliseconds = 3 seconds
      }
    } catch (error) {
      if (error.response.data.code === 1002) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(validationErrors[key]);
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="register-page">
        <Card className="register-page-card">
          <Card.Body>
            <Card.Title className="text-center mb-4">
              <h4 className="fw-bold">Welcome to Book Store</h4>
              <p className="text-muted">Create your account</p>
            </Card.Title>
            <Form onSubmit={handleRegister}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="username">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <InputGroup.Text
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="dob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="w-100 mb-3">
                Register
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center">
            <p className="text-muted mb-0">
              Already have an account?{" "}
              <a href="/login" className="fw-bold text-primary">
                Login here
              </a>
            </p>
          </Card.Footer>
        </Card>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
