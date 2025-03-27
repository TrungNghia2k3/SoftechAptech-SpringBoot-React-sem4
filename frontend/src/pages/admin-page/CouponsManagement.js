import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import CreateCouponModal from "../../components/admin/coupon/CreateCouponModal";
import DeleteCouponModal from "../../components/admin/coupon/DeleteCouponModal";
import EditCouponModal from "../../components/admin/coupon/EditCouponModal";
import CustomPagination from "../../components/pagination/CustomPagination";
import {
  createCoupon,
  deleteCoupon,
  editCoupon,
  getAllPaginationSortCoupons,
} from "../../services/couponService";
import { formatCurrencyVND } from "../../utilities/Utils";

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [editedCoupon, setEditedCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    id: "",
    type: "",
    value: "",
    description: "",
    pointCost: "",
    minOrderValue:"",
  });

  useEffect(() => {
    fetchCoupons(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchCoupons = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllPaginationSortCoupons(
        page,
        10,
        sortBy,
        sortDirection
      );
      setCoupons(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    }
  };

  const handleCreateCoupon = async () => {
    if (newCoupon.id && newCoupon.type) {
      try {
        await createCoupon(newCoupon);
        toast.success("Coupon created successfully");
        handleCloseCreateModal();
        fetchCoupons(currentPage, sortBy, sortDirection);
        setCurrentPage(1);
        setSortDirection("desc");
      } catch (error) {
        handleApiError(error);
      }
    } else {
      toast.error("Please fill in all the required fields");
    }
  };

  const handleDeleteCoupon = async () => {
    if (currentCoupon) {
      // Đảm bảo currentCoupon được sử dụng
      try {
        await deleteCoupon(currentCoupon.id);
        toast.success("Coupon deleted successfully");
        handleCloseDeleteModal();
        fetchCoupons(currentPage, sortBy, sortDirection);
      } catch (error) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  const handleEditCoupon = async () => {
    if (editedCoupon) {
      try {
        await editCoupon(editedCoupon.id, editedCoupon);
        toast.success("Coupon updated successfully");
        handleCloseEditModal();
        fetchCoupons(currentPage, sortBy, sortDirection);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleSort = (column) => {
    const direction =
      sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);
    fetchCoupons(currentPage, column, direction);
  };

  const handleApiError = (error) => {
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      if (code === 1035 || code === 1036) {
        toast.error(message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewCoupon({
      id: "",
      type: "",
      value: "",
      description: "",
      pointCost: "",
      minOrderValue: "",
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentCoupon(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedCoupon(null);
  };

  return (
    <div className="coupons-management">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h1 className="fw-bold">Coupons Management</h1>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          Create
        </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                Id
                {sortBy === "id" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th onClick={() => handleSort("type")}>
                Type
                {sortBy === "type" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th onClick={() => handleSort("value")}>
                Value
                {sortBy === "value" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th onClick={() => handleSort("description")}>
                Description
                {sortBy === "description" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th onClick={() => handleSort("pointCost")}>
                Point Cost
                {sortBy === "pointCost" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th onClick={() => handleSort("minOrderValue")}>
                Min Order Value
                {sortBy === "minOrderValue" && (
                  <i
                    className={`bi bi-caret-${
                      sortDirection === "asc" ? "up" : "down"
                    }-fill ms-1`}
                  />
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.id}</td>
                <td>{coupon.type}</td>
                <td>
                  {coupon.type === "AMOUNT"
                    ? `${formatCurrencyVND(coupon.value)}`
                    : coupon.type === "PERCENTAGE"
                    ? `${coupon.value}%`
                    : "Freeship"}
                </td>
                <td>{coupon.description}</td>
                <td>{coupon.pointCost}</td>
                <td>{formatCurrencyVND(coupon.minOrderValue)}</td>
                <td className="actions-column">
                  <Button
                    variant="warning"
                    onClick={() => {
                      setEditedCoupon(coupon);
                      setShowEditModal(true);
                    }}
                    className="me-2"
                  >
                    Update
                  </Button>
                  {/* <Button
                    variant="danger"
                    onClick={() => {
                      setCurrentCoupon(coupon);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <CreateCouponModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
        newCoupon={newCoupon}
        setNewCoupon={setNewCoupon}
        handleCreateCoupon={handleCreateCoupon}
      />
      <DeleteCouponModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDeleteCoupon={handleDeleteCoupon}
      />
      <EditCouponModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        editedCoupon={editedCoupon}
        setEditedCoupon={setEditedCoupon}
        handleEditCoupon={handleEditCoupon}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default CouponsManagement;
