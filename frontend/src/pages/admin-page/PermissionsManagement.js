import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import ModalForm from "../components/permissions-page/modals/ModalForm";
import DataTable from "../components/permissions-page/tables/DataTable";
import { getAllPermissions } from "../services/permissionsService";

const PermissionsManagement = () => {
  const [items, setItems] = useState([]);

  const getItems = async () => {
    try {
      const response = await getAllPermissions();
      setItems(response.result);
    } catch (error) {
      toast.error("Failed to fetch permissions");
    }
  };

  const addItemToState = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const updateState = (item) => {};

  const deleteItemFromState = (name) => {
    setItems((prevItems) => prevItems.filter((item) => item.name !== name));
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}>Permissions Management</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <ModalForm
              buttonLabel="Add Permission"
              addItemToState={addItemToState}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable
              items={items}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default PermissionsManagement;
