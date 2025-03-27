// Importing necessary modules from React and Redux
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Importing the fetchUserInfo action creator from the auth slice
import { useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import { fetchUserInfo } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  
  // Getting the dispatch function from Redux to dispatch actions
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false); // State to manage redirection

  // Selecting the token and user state from the Redux store
  const { token, user } = useSelector((state) => state.auth);

  // Effect hook to fetch user info if a token is available
  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo()); // Dispatching the fetchUserInfo action to retrieve user details
    }
  }, [token, dispatch]);

  // Initializing user details with default values

  let username = null;
  // let id = null;
  // let firstName = null;
  // let lastName = null;
  // let dob = null;
  // let phone = null;
  // let noPassword = false;
  // let active = false;
  // let otp = null;
  // let otpGeneratedTime = null;
  let roles = [];

  // If user object exists, destructure the user properties into individual variables
  if (user) {
    ({
      username,
      roles,
      // id,
      // firstName,
      // lastName,
      // dob,
      // phone,
      // noPassword,
      // active,
      // otp,
      // otpGeneratedTime,
    } = user);
  }

  useEffect(() => {
    if (user && !redirected) {
      const userRoles = user.roles?.length > 0 ? user.roles[0].name : null;
      if (userRoles === "ADMIN") {
        navigate("/admin/dashboard");
        setRedirected(true); // Prevent further redirection
      }
    }
  }, [user, navigate, redirected]);

  // Extracting the name of the user's first role, if roles array is not empty
  const userRoles = roles?.length > 0 ? roles[0].name : null;

  // Logging user information for debugging purposes
  return (
    <div className="App">
      {/* Rendering the Header component with authentication status and user details */}
      <Header
        isLoggedIn={!!token} // Passing a boolean indicating if the user is logged in
        userRoles={userRoles} // Passing the user's roles
        username={username ?? null} // Passing the user's username
      />
      <div className="content">
        {/* Rendering AppRoutes component for managing the routing of the application */}
        <AppRoutes isLoggedIn={!!token} userRoles={userRoles} />
      </div>
      {/* Conditionally rendering the Footer component if the user is not an ADMIN */}
      {userRoles !== "ADMIN" && <Footer />}
    </div>
  );
}

export default App;
