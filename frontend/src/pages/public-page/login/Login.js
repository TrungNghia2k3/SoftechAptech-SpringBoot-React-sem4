import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash, Google } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { OAuthConfig } from "../../../configurations/configuration";
import { login } from "../../../features/auth/authSlice";
import { getToken } from "../../../services/localStorageService";
import "./login.scss";

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Getting the dispatch function from Redux

  // Selecting the loading and error state from the Redux store
  const { loading, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // Preventing the default form submission behavior
    dispatch(login({ username, password })); // Dispatching the login action with the input data
  };

  // Navigate to authenticate of Google
  const handleContinueWithGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  return (
    <>
      <div className="login-page">
        <Card className="login-page-card">
          <Card.Body>
            <Card.Title>
              <h5>Welcome to Book Store</h5>
            </Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroup.Text onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <a href="/verify-username" className="text-decoration-none">
                <p className="text-end">Forgot password?</p>
              </a>
              <Button
                variant="primary"
                type="submit"
                onClick={handleLogin}
                className="w-100 mb-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
                {/* Displaying a loading state during the API call */}
              </Button>
              <Button
                variant="secondary"
                onClick={handleContinueWithGoogle}
                className="w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <Google size={20} />
                Continue with Google
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <a href="/register" className="w-100 btn btn-success">
              Create an account
            </a>
          </Card.Footer>
          <p className="text-center ">
            <a href="/verify-user" className="text-decoration-none">
              Not verified yet
            </a>
          </p>
        </Card>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
}
