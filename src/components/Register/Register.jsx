import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Minimum 6 characters";
    }
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("https://ticketing-backend-9uw2.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "admin",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        setFormErrors({ email: data.error || "Registration failed." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormErrors({ email: "Something went wrong!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="hubly-logo">
          <img src="/assets/icons/hubly-logo.png" alt="Hubly Logo" />
          <span>Hubly</span>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-body">
            <div className="form-header">
              <h3 className="form-title">Create an account</h3>
              <Link to="/login" className="signin-link">Sign in instead</Link>
            </div>

            <input
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              onBlur={() => handleBlur("firstName")}
            />
            {touchedFields.firstName && formErrors.firstName && (
              <p className="error-text">{formErrors.firstName}</p>
            )}

            <input
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              onBlur={() => handleBlur("lastName")}
            />
            {touchedFields.lastName && formErrors.lastName && (
              <p className="error-text">{formErrors.lastName}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur("email")}
            />
            {touchedFields.email && formErrors.email && (
              <p className="error-text">{formErrors.email}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onBlur={() => handleBlur("password")}
            />
            {touchedFields.password && formErrors.password && (
              <p className="error-text">{formErrors.password}</p>
            )}

            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onBlur={() => handleBlur("confirmPassword")}
            />
            {touchedFields.confirmPassword && formErrors.confirmPassword && (
              <p className="error-text">{formErrors.confirmPassword}</p>
            )}

            <p className="terms-text">
              By creating an account, I agree to the{" "}
              <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create an account"}
            </button>
          </div>
        </form>
      </div>

      <div className="register-right">
        <img src="/assets/icons/image 1.png" alt="Register visual" />
      </div>
    </div>
  );
}

export default Register;
