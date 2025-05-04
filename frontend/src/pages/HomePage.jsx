import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage events
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to Login & Sign up Test</h1>

        {/* If user is logged in */}
        {user ? (
          <div>
            <p className="welcome-message">
              You are logged in as <strong>{user.username}</strong>.
            </p>
            <div className="profile-section">
              <h2 className="profile-heading">Your Profile Information</h2>
              <p className="profile-info">
                <strong>Username:</strong> {user.username}
              </p>
              {user.email && (
                <p className="profile-info">
                  <strong>Email:</strong> {user.email}
                </p>
              )}
            </div>
          </div>
        ) : (
          // If user is not logged in
          <div>
            <p className="login-prompt">
              Please login or register to continue.
            </p>
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
