"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader, CheckCircle } from "lucide-react";
import "./form.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${apiUrl}/api/auth/customer/forgot-password`, { email });

      setIsSuccess(true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Mail className="auth-icon" size={28} />
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
          </div>

          {isSuccess ? (
            <div className="auth-success">
              <CheckCircle size={50} className="success-icon" />
              <h3>Check Your Email</h3>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="small-text">
                If you don't see the email, check your spam folder or make sure
                you entered the correct email address.
              </p>
              <Link to="/login" className="auth-button back-button">
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div
                className={`form-group ${focused ? "focused" : ""} ${
                  email ? "has-value" : ""
                }`}
              >
                <div className="input-icon">
                  <Mail size={18} />
                </div>
                <input
                  className="input-field"
                  type="email"
                  id="email"
                  value={email}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="spinner" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>

              <div className="auth-links">
                <Link to="/login" className="back-link">
                  <ArrowLeft size={16} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
