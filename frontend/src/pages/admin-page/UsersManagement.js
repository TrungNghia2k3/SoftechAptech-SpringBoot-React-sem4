import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import CustomPagination from "../../components/pagination/CustomPagination";
import { getAllPaginationSorUsers, getUser } from "../../services/userService";
import { getAllOrdersByUserId } from "../../services/orderService";
import { getAddressList } from "../../services/userAddressService";
import UserDetailModal from "../../components/admin/user-management/UserDetailModal";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userAdressesList, setUserAdressesList] = useState([]);

  useEffect(() => {
    fetchUsers(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchUsers = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllPaginationSorUsers(
        page,
        10,
        sortBy,
        sortDirection
      );
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleShowUserModal = async (user) => {
    try {
      const userInfo = await getUser(user.id);
      const orders = await getAllOrdersByUserId(user.id);
      const userAdresses = await getAddressList(user.id);
      setCurrentUser(userInfo.result);
      setUserOrders(orders.result);
      setUserAdressesList(userAdresses.result);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to fetch user");
    }
  };

  const handleCloseUserModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleSort = (column) => {
    const direction =
      sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);
  };

  return (
    <>
      <h1 className="fw-bold">Users Management</h1>
      <Table striped bordered hover responsive="md" className="mt-3">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("username")}
              style={{ cursor: "pointer", width: "150px" }}
            >
              UserName
              {sortBy === "username" && (
                <i
                  className={`bi bi-caret-${
                    sortDirection === "asc" ? "up" : "down"
                  }-fill ms-1`}
                ></i>
              )}
            </th>
            <th
              onClick={() => handleSort("firstName")}
              style={{ cursor: "pointer", width: "150px" }}
            >
              First Name
              {sortBy === "firstName" && (
                <i
                  className={`bi bi-caret-${
                    sortDirection === "asc" ? "up" : "down"
                  }-fill ms-1`}
                ></i>
              )}
            </th>
            <th
              onClick={() => handleSort("lastName")}
              style={{ cursor: "pointer", width: "150px" }}
            >
              Last Name
              {sortBy === "lastName" && (
                <i
                  className={`bi bi-caret-${
                    sortDirection === "asc" ? "up" : "down"
                  }-fill ms-1`}
                ></i>
              )}
            </th>
            <th
              onClick={() => handleSort("dob")}
              style={{ cursor: "pointer", width: "150px" }}
            >
              Date of Birth
              {sortBy === "dob" && (
                <i
                  className={`bi bi-caret-${
                    sortDirection === "asc" ? "up" : "down"
                  }-fill ms-1`}
                ></i>
              )}
            </th>
            <th
              onClick={() => handleSort("phone")}
              style={{ cursor: "pointer", width: "150px" }}
            >
              Phone
              {sortBy === "phone" && (
                <i
                  className={`bi bi-caret-${
                    sortDirection === "asc" ? "up" : "down"
                  }-fill ms-1`}
                ></i>
              )}
            </th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.dob}</td>
              <td>{user.phone}</td>
              <td>
                <Button
                  className="ms-2"
                  variant="primary"
                  onClick={() => handleShowUserModal(user)}
                >
                  Show
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Sử dụng UserDetailModal */}
      <UserDetailModal
        showModal={showModal}
        handleCloseUserModal={handleCloseUserModal}
        currentUser={currentUser}
        userOrders={userOrders}
        userAdressesList={userAdressesList}
      />

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default UsersManagement;
