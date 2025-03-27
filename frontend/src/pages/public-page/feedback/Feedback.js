import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { createFeedback } from "../../../services/feedbackService";
import "./Feedback.scss";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleSubjectChange = (e) => setSubject(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const validateForm = () => {
    let errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
      toast.error(errors.name);
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      toast.error(errors.email);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is not valid";
      toast.error(errors.email);
    }

    if (!subject.trim()) {
      errors.subject = "Subject is required";
      toast.error(errors.subject);
    }

    if (!message.trim()) {
      errors.message = "Message is required";
      toast.error(errors.message);
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await createFeedback({
          name,
          email,
          subject,
          message,
        });
        toast.success("Feedback submitted successfully");

        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } catch (error) {
        toast.error("Failed to submit feedback");
      }
    }
  };

  return (
    <div className="feedback-container">
      <Card className="feedback-card">
        <Card.Body>
          <Card.Title>
            <h5>Feedback Form</h5>
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group controlId="subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={subject}
                onChange={handleSubjectChange}
                placeholder="Enter subject"
              />
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={handleMessageChange}
                placeholder="Enter your message"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className=" mt-3 w-100 d-flex align-items-center justify-content-center gap-2"
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Feedback;
