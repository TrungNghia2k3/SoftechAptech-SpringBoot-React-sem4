import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer-container bg-dark text-white py-3">
      <div className="container">
        <div className="row d-flex justify-content-between align-items-center">
          <p className="col-12 col-md-4 mb-0 text-center text-md-start">
            &copy; 2024 Book Store, Inc
          </p>

          <a
            href="/"
            className="col-12 col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 text-white text-decoration-none"
          >
            <img
              src="/logo/aptech-logo.avif"
              alt="Book Store logo"
              width="200"
              height="40"
              className="d-inline-block align-top rounded"
            />
          </a>

          <ul className="nav col-12 col-md-4 justify-content-center justify-md-end mb-0">
            <li className="nav-item">
              <a href="/" className="nav-link px-2 text-white">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/feedback" className="nav-link px-2 text-white">
                Feedback
              </a>
            </li>
            <li className="nav-item">
              <a href="/faqs" className="nav-link px-2 text-white">
                FAQs
              </a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link px-2 text-white">
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
