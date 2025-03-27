import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Container } from "react-bootstrap";

// Định nghĩa schema validation sử dụng Yup
const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const MyForm = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Validate form using Yup
      await validationSchema.validate(values, { abortEarly: false });

      // Console log giá trị truyền đi
      console.log("Form values:", values);

      // If validation passes, send POST request to server
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        values
      );
      console.log("Server response:", response.data);

      // Hiển thị thông báo thành công
      toast.success("Form submitted successfully!");

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      // Handle validation errors or server errors
      console.error("Form submission error:", error);

      // Hiển thị thông báo lỗi từ Yup
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Form submission failed. Please check your inputs.");
      }
    } finally {
      // Set submitting state to false
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Form Example</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, isValid, dirty }) => (
          <Container>
            <Form>
              <div className="mb-3">
                <label htmlFor="firstName">First Name</label>
                <Field
                  type="text"
                  name="firstName"
                  className={`form-control ${
                    touched.firstName && errors.firstName ? "is-invalid" : ""
                  }`}
                />
                {touched.firstName && errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="lastName">Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  className={`form-control ${
                    touched.lastName && errors.lastName ? "is-invalid" : ""
                  }`}
                />
                {touched.lastName && errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className={`form-control ${
                    touched.email && errors.email ? "is-invalid" : ""
                  }`}
                />
                {touched.email && errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="btn btn-primary"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          </Container>
        )}
      </Formik>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default MyForm;
