"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./form.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Verify token validity
    const verifyToken = async () => {
      try {
        // This is just a simple check to see if the token exists
        // The actual validation happens on the server when resetting the password
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
        toast.error("Invalid or expired reset token");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        `${apiUrl}/api/auth/customer/reset-password/${token}`,
        {
          password,
        }
      );

      setIsSuccess(true);
      toast.success("Password reset successful!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-loading">
              <Loader size={40} className="spinner" />
              <p>Verifying reset token...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-error">
              <AlertCircle size={50} className="error-icon" />
              <h3>Invalid or Expired Link</h3>
              <p>
                The password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <Link to="/forgot-password" className="auth-button">
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Lock className="auth-icon" size={28} />
            <h2>Reset Password</h2>
            <p>Enter your new password</p>
          </div>

          {isSuccess ? (
            <div className="auth-success">
              <CheckCircle size={50} className="success-icon" />
              <h3>Password Reset Successful</h3>
              <p>
                Your password has been reset successfully. You will be
                redirected to the login page shortly.
              </p>
              <Link to="/login" className="auth-button">
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div
                className={`form-group ${
                  focused === "password" ? "focused" : ""
                } ${password ? "has-value" : ""}`}
              >
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <label htmlFor="password">New Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div
                className={`form-group ${
                  focused === "confirmPassword" ? "focused" : ""
                } ${confirmPassword ? "has-value" : ""}`}
              >
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={handleBlur}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>

              <div className="password-requirements">
                <p className="requirement">
                  Password must be at least 8 characters long
                </p>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="spinner" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
