import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserInfo } from "../../features/auth/authSlice";

export default function Authenticate() {
  const navigate = useNavigate(); // For navigating between routes
  const dispatch = useDispatch(); // For dispatching Redux actions

  useEffect(() => {
    // Extract code and error from URL
    const authCodeRegex = /code=([^&]+)/;
    const errorRegex = /error=([^&]+)/;

    const isMatch = window.location.href.match(authCodeRegex);
    const errorMatch = window.location.href.match(errorRegex);

    if (errorMatch) {
      // If an error is found in the URL, navigate to the login page
      navigate("/login");
    } else if (isMatch) {
      // If an auth code is found, extract it
      const authCode = isMatch[1];

      // Exchange auth code for token via backend API
      fetch(
        `http://localhost:8080/api/auth/outbound/authentication?code=${authCode}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.result?.token) {
            // Store the received token in localStorage
            localStorage.setItem("token", data.result.token);

            // Fetch user information using the token
            dispatch(fetchUserInfo())
              .unwrap()
              .then((userInfo) => {
                console.log("User info:", userInfo);
                // Redirect to home page after fetching user info
                window.location.href = "/";
              })
              .catch((error) => {
                console.error("Error fetching user info:", error);
                toast.error("Error fetching user info. Please try again.");
              });
          } else {
            // If no token is received, log the error and notify the user
            console.error("No token received:", data);
            toast.error("Authentication failed. Please try again.");
          }
        })
        .catch((error) => {
          // Handle errors in token exchange
          console.error("Error fetching token:", error);
          toast.error("Error authenticating. Please try again.");
        });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    // Check for existing access token in localStorage
    const accessToken = localStorage.getItem("token");

    // If token exists, navigate to home page
    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row>
        <Col className="text-center">
          <Spinner animation="border" /> {/* Display loading spinner */}
          <h4>Authenticating...</h4>{" "}
          {/* Display message while authenticating */}
        </Col>
      </Row>
    </Container>
  );
}
