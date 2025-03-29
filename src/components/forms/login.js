"use client";

import { useState, useContext, useEffect } from "react";
import "./form.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../productContext";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Loader } from "lucide-react";

export default function Login() {
  const [check, setCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const {
    authenticated,
    setAuthenticated,
    setShouldFetchCart,
    setLocalCartLength,
  } = useContext(ProductContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [changePassword, setChangePassword] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/auth/customer/checkAuth`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Correct way to send token
            },
          }
        );

        if (response.status === 200) {
          setAuthenticated(true);
          toast("You are already logged in");
          navigate("../");
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (authenticated === null) {
    return (
      <div className="auth-loading">
        <Loader size={40} className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  const fetchData = async (Token) => {
    const headers = {
      Authorization: `Bearer ${Token}`,
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart/list`,
        {
          headers,
        }
      );
      const userCartItems = await response.data.cartItems;
      const storedCartList =
        JSON.parse(localStorage.getItem("localCartList")) || [];
      const cartItemsToAdd = storedCartList.filter(
        (item) => !userCartItems.some((userItem) => userItem._id === item._id)
      );

      await Promise.all(
        cartItemsToAdd.map(async (cartItem) => {
          const existingItem = userCartItems.find(
            (item) => item._id === cartItem._id
          );

          if (!existingItem) {
            const response = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/cart/add`,
              { productId: cartItem._id },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${token}`, // Correct way to send token
                },
              }
            );
          } else {
          }
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setShouldFetchCart(true);
      setAuthenticated(true);
      window.location.reload();
    }
  };

  function handlePassword() {
    setChangePassword(!changePassword);
  }

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    function callCheck() {
      setCheck(true);
      setTimeout(() => {
        setCheck(false);
      }, 3000);
    }
    const loginPromise = async () => {
      callCheck();
      const response = await axios.post(`${apiUrl}/api/auth/customer/login`, {
        email,
        password,
      },{withCredentials:true});
      localStorage.setItem("token", response.data.token);
      return response;
    };

    toast.promise(loginPromise(), {
      loading: "Logging in...",
      success: (response) => {
        const { success } = response.data;

        if (success) {
          fetchData();
          setAuthenticated(true);
          navigate("/");
          return "Login successful!";
        } else {
          throw new Error(response.data.message);
        }
      },
      error: (error) => {
        console.error("Login failed:", error);
        return error.message || "An error occurred";
      },
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <LogIn className="auth-icon" size={28} />
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
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

          <form className="auth-form" onSubmit={handleLogin}>
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
                type="text"
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
              <small className="helper-text">
                test user: johndoe@gmail.com
              </small>
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
                  setErr("");
                  setPassword(e.target.value);
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
              <small className="helper-text">test password: johndoe12#</small>
            </div>

            <button type="submit" className="auth-button">
              <span>Sign In</span>
              <LogIn size={18} />
            </button>

            <div className="auth-links">
              <span>New user?</span>
              <Link to="/signup" className="auth-link">
                <span>Create Account</span>
                <UserPlus size={16} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
