import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { createPermission } from "../../../../services/permissionsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEditForm({ addItemToState, updateState, item, handleClose }) {
  const [form, setValues] = useState({
    name: "",
    description: "",
  });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormAdd = async (e) => {
    e.preventDefault();
    try {
      await createPermission(form.name, form.description);
      addItemToState(form);
      toast.success("Permission created successfully");
      handleClose(); // Close the modal on successful submit
    } catch (error) {
      if (error.response.data.code === 1019) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(key + " " + validationErrors[key]);
        }
      } else {
        toast.error("Failed to create permission");
      }
    }
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    updateState(form);
    toast.success("Permission updated successfully");
    handleClose(); // Close the modal on successful submit
  };

  useEffect(() => {
    if (item) {
      const { name, description } = item;
      setValues({ name, description });
    }
  }, [item]);

  return (
    <>
      <Form onSubmit={item ? submitFormEdit : submitFormAdd}>
        <FormGroup>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            id="name"
            disabled={!!item}
            onChange={onChange}
            value={form.name || ""}
          />
        </FormGroup>
        <FormGroup>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            id="description"
            onChange={onChange}
            value={form.description || ""}
          />
        </FormGroup>
        <Button className="mt-2" type="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default AddEditForm;
