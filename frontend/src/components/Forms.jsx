import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authService from "../services/authService";
import "./Forms.css";

const Forms = () => {
  // Toggle between login and registration views
  const [mode, setMode] = useState("login");
  // Handle error messages from API responses
  const [error, setError] = useState("");
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Navigate to different routes
  const navigate = useNavigate();

  // Required Login requirements
  const loginSchema = Yup.object({
    username: Yup.string().required("Username or email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Required Sign Up requirements
  const registerSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Email must be a valid format (e.g. example@domain.com)"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // Initial values for forms
  const initialValues = {
    login: {
      username: "",
      password: "",
    },
    register: {
      username: "",
      email: "",
      password: "",
    },
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await authService.login(values);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Check if the error is about the username or password
        if (error.response.data.message.includes("password")) {
          setError("Wrong password. Please try again.");
        } else {
          setError("Invalid username or email. Please check your credentials.");
        }
      } else {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : "Login failed. Please try again."
        );
      }
    }
    setSubmitting(false);
  };

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
      };

      await authService.register(userData);
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.data.message.includes("email already exists")
      ) {
        setError("This email is already used with another account.");
      } else if (
        error.response &&
        error.response.data.message.includes("username already exists")
      ) {
        setError("This username is already taken.");
      } else {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : "Registration failed"
        );
      }
    }
    setSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      {/* Login Form Section */}
      {mode === "login" ? (
        <>
          {/* Login Form Header */}
          <h2 className="form-title">Login</h2>

          {/* Display error messages if any */}
          {error && <div className="error-message">{error}</div>}

          {/* Login Form with Formik for validation and submission handling */}
          <Formik
            initialValues={initialValues.login}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {/* Username/Email Input Field */}
                <div className="form-group">
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    placeholder="Username/Email"
                  />
                  {/* Error message for username field */}
                  {touched.username && errors.username && (
                    <div className="input-error">{errors.username}</div>
                  )}
                </div>

                {/* Password Input Field */}
                <div className="form-group">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Password"
                  />
                  {/* Error message for password field */}
                  {touched.password && errors.password && (
                    <div className="input-error">{errors.password}</div>
                  )}
                </div>

                {/* Password Visibility Toggle */}
                <div className="password-toggle">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label htmlFor="showPassword">Show password</label>
                </div>

                {/* Submit Button - changes text based on submission state */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Form Footer with link to switch to registration mode */}
          <div className="form-footer">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className="toggle-link"
            >
              Register Here
            </span>
          </div>
        </>
      ) : (
        <>
          {/* Registration Form Header */}
          <h2 className="form-title">Registration</h2>

          {/* Display error messages if any */}
          {error && <div className="error-message">{error}</div>}

          {/* Registration Form with Formik for validation and submission handling */}
          <Formik
            initialValues={initialValues.register}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {/* Username Input Field */}
                <div className="form-group">
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    placeholder="Username"
                  />
                  {/* Error message for username field */}
                  {touched.username && errors.username && (
                    <div className="input-error">{errors.username}</div>
                  )}
                </div>

                {/* Email Input Field */}
                <div className="form-group">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Email"
                  />
                  {/* Error message for email field */}
                  {touched.email && errors.email && (
                    <div className="input-error">{errors.email}</div>
                  )}
                </div>

                {/* Password Input Field */}
                <div className="form-group">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-input"
                    placeholder="Password"
                  />
                  {/* Error message for password field */}
                  {touched.password && errors.password && (
                    <div className="input-error">{errors.password}</div>
                  )}
                </div>

                {/* Password Visibility Toggle */}
                <div className="password-toggle">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label htmlFor="showPassword">Show password</label>
                </div>

                {/* Submit Button - changes text based on submission state */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Form Footer with link to switch to login mode */}
          <div className="form-footer">
            Already have an account?{" "}
            <span
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className="toggle-link"
            >
              Sign in Here
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Forms;
