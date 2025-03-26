"use client";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./form.css";
import { ProductContext } from "../productContext";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  AlertCircle,
  CheckCircle,
  LogIn,
  Loader,
} from "lucide-react";

export default function Signup() {
  const [check, setCheck] = useState(false);
  const { authenticated } = useContext(ProductContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [specialChar, setNoSpecialChar] = useState(false);
  const [changePassword, setChangePassword] = useState(true);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (authenticated) {
        toast("You are already logged in");
        navigate("../");
      }
    };
    checkAuth();
  }, [authenticated]);

  function handlePassword() {
    setChangePassword(!changePassword);
  }

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  function containsSpecialCharacter(password) {
    // Regex for special characters
    var specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    // Test if the password does not contain a special character
    return specialCharRegex.test(password);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    function callCheck() {
      setCheck(true);
      setTimeout(() => {
        setCheck(false);
      }, 3000);
    }

    const serverUrl = `${process.env.REACT_APP_API_URL}/api/auth/customer/signup`;

    try {
      callCheck();
      if (specialChar) {
        const response = await axios.post(serverUrl, {
          fullname,
          username,
          email,
          password,
        });

        const { success } = response.data;

        if (success) {
          toast.success("Account created successfully!");
          navigate("/login");
          console.log(response.data);
          setErr(response.data.message);
        } else {
          console.error(response.data.message);
          setErr(response.data.message);
        }
      } else {
        toast.error("Add special character to password");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <UserPlus className="auth-icon" size={28} />
            <h2>Create Account</h2>
            <p>Join our community today</p>
          </div>

          {check && (
            <div className="auth-status checking">
              <Loader size={20} className="spinner" />
              <span>Checking your details...</span>
            </div>
          )}

          {err && (
            <div className="auth-status error">
              <span>{err}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSignup}>
            <div
              className={`form-group ${
                focused === "username" ? "focused" : ""
              } ${username ? "has-value" : ""}`}
            >
              <div className="input-icon">
                <User size={18} />
              </div>
              <input
                className="input-field"
                type="text"
                id="username"
                value={username}
                onFocus={() => handleFocus("username")}
                onBlur={handleBlur}
                onChange={(e) => {
                  setErr("");
                  setUsername(e.target.value);
                }}
                required
              />
              <label htmlFor="username">Username</label>
            </div>

            <div
              className={`form-group ${
                focused === "fullname" ? "focused" : ""
              } ${fullname ? "has-value" : ""}`}
            >
              <div className="input-icon">
                <User size={18} />
              </div>
              <input
                className="input-field"
                type="text"
                id="fullname"
                value={fullname}
                onFocus={() => handleFocus("fullname")}
                onBlur={handleBlur}
                onChange={(e) => {
                  setErr("");
                  setFullname(e.target.value);
                }}
                required
              />
              <label htmlFor="fullname">Full Name</label>
            </div>

            <div
              className={`form-group ${focused === "email" ? "focused" : ""} ${
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
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                onChange={(e) => {
                  setErr("");
                  setEmail(e.target.value);
                }}
                required
              />
              <label htmlFor="email">Email Address</label>
            </div>

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
                type={changePassword ? "password" : "text"}
                id="password"
                value={password}
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
                onChange={(e) => {
                  if (e.target.value.length > 20) {
                    e.target.value = "";
                    toast.error("Password is too long");
                  } else {
                    setPassword(e.target.value);
                  }
                  if (!containsSpecialCharacter(e.target.value)) {
                    setNoSpecialChar(false);
                  } else {
                    setNoSpecialChar(true);
                  }
                  setErr("");
                }}
                required
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={handlePassword}
                aria-label={changePassword ? "Show password" : "Hide password"}
              >
                {changePassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="password-requirements">
              {specialChar ? (
                <div className="requirement valid">
                  <CheckCircle size={16} />
                  <span>Contains special character</span>
                </div>
              ) : (
                <div className="requirement invalid">
                  <AlertCircle size={16} />
                  <span>
                    Password should contain at least one special character
                  </span>
                </div>
              )}
            </div>

            <button type="submit" className="auth-button">
              <span>Create Account</span>
              <UserPlus size={18} />
            </button>

            <div className="auth-links">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-link">
                <span>Sign In</span>
                <LogIn size={16} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
