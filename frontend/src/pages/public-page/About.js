import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const About = () => {
  return (
    <>
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid bg-white py-2">
        <Container>
          <h1 className="display-3">Welcome to Book Store!</h1>
          <p className="lead">
            Your go-to place for a vast selection of books from all genres.
            Explore our collection and find your next favorite read.
          </p>
          <p>
            <Button variant="primary" href="/">
              Browse Books &raquo;
            </Button>
          </p>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <Row className="my-4">
          <Col md={4} className="bg-white">
            <h2>Our Mission</h2>
            <p>
              At Book Store, we believe in the power of reading to transform
              lives. Our mission is to provide a diverse collection of books
              that inspire, educate, and entertain. We are committed to
              promoting literacy and fostering a love of reading in our
              community.
            </p>
          </Col>
          <Col md={4} className="bg-white">
            <h2>Services</h2>
            <p>
              We offer a wide range of services including book recommendations,
              special orders, and community events. Whether you're looking for
              the latest bestseller, a rare classic, or a children's book, our
              knowledgeable staff is here to help you find the perfect book.
            </p>
          </Col>
          <Col md={4} className="bg-white">
            <h2>Contact Us</h2>
            <p>Have questions or need assistance? Reach out to us at:</p>
            <p>
              <strong>Email:</strong> support@bookstore.com
              <br />
              <strong>Phone:</strong> (123) 456-7890
              <br />
              <strong>Address:</strong> 38 Yen Bai, Hai Chau, Da Nang, Viet Nam
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
