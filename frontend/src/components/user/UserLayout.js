import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import UserSidebar from "./user-sidebar/UserSidebar";
import { FaBars } from "react-icons/fa";

const UserLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  // Update isSmallScreen based on window size
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 992); // Adjust based on Bootstrap breakpoints
  };

  useEffect(() => {
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close the sidebar when the route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [location]);

  return (
    <Container>
      <Row>
        {/* Sidebar for larger screens */}
        <Col
          xs={12}
          lg={2}
          className="position-sticky d-none d-lg-block"
          style={{ top: 0 }}
        >
          <UserSidebar />
        </Col>
        <Col xs={12} lg={10}>
          {/* FaBars icon for small screens to toggle the sidebar */}
          {isSmallScreen && (
            <Button
              variant="outline-secondary"
              className="d-lg-none mb-3"
              onClick={toggleSidebar}
            >
              <FaBars />
            </Button>
          )}
          {children}
        </Col>
      </Row>

      {/* Offcanvas for small screens */}
      {isSmallScreen && (
        <Offcanvas
          show={showSidebar}
          onHide={toggleSidebar}
          responsive="lg"
          placement="start"
          style={{ width: "50%" }} // Set the width to 50% of the screen
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            <UserSidebar />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Container>
  );
};

export default UserLayout;
