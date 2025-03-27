import React, { useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { getMyInfo, updateUser } from "../../services/userService";
import { toast, ToastContainer } from "react-toastify";

export default function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
  });

  const getUserDetails = async () => {
    try {
      const response = await getMyInfo();
      setUserDetails(response.data.result);
      console.log(response.data.result)
      setFormData({
        firstName: response.data.result.firstName,
        lastName: response.data.result.lastName,
        dob: response.data.result.dob,
        phone: response.data.result.phone,
      });
    } catch (error) {
      console.log("Failed to fetch user details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userDetails.id, formData);
      toast.success("User details updated successfully.");
      getUserDetails(); // Refresh user details
    } catch (error) {
      if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(validationErrors[key]);
        }
      } else {
        console.error("Failed to update user details:", error);
        toast.error("Failed to update user details.");
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      {userDetails && (
        <>
          <h3 className="fw-bold">Profile</h3>
          <h6>Current points: {userDetails.points}</h6>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formDob">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
