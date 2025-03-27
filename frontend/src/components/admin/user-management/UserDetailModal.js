import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import {
  formatCurrencyVND,
  formatDateWithAmPm,
} from "../../../utilities/Utils";

const UserDetailModal = ({
  showModal,
  handleCloseUserModal,
  currentUser,
  userOrders,
  userAdressesList,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseUserModal} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">User Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              {/* Profile */}
              {currentUser && (
                <Card className="p-3">
                  <h5>Profile</h5>
                  <p>
                    <span className="fw-bold">Username:</span>{" "}
                    {currentUser.username}
                  </p>
                  <p>
                    <span className="fw-bold">First Name:</span>{" "}
                    {currentUser.firstName}
                  </p>
                  <p>
                    <span className="fw-bold">Last Name:</span>
                    {currentUser.lastName}
                  </p>
                  <p>
                    <span className="fw-bold">Date of Birth:</span>{" "}
                    {currentUser.dob}
                  </p>
                  <p>
                    <span className="fw-bold">Phone:</span> {currentUser.phone}
                  </p>
                  <p>
                    <span className="fw-bold">Points:</span>{" "}
                    {currentUser.points}
                  </p>
                </Card>
              )}
              {/* Delivery Address List */}
              <Card className="p-3 mt-3">
                <h5>Delivery Address List</h5>
                <ul>
                  {userAdressesList.map((address) => (
                    <li key={address.id}>
                      {address.fullName}, {address.fullAddress}, {address.phone}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
            <Col>
              {/* User Order List */}
              <Card className="p-3">
                <h5>User Order List</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Order Date</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{formatDateWithAmPm(order.orderDate)}</td>
                        <td>{formatCurrencyVND(order.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseUserModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
