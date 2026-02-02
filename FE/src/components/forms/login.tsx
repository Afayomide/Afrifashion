"use client";

import { useState, useContext, useEffect } from "react";
import "./form.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ProductContext } from "../productContext";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Loader } from "lucide-react";

export default function Login() {
  const [check, setCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const {
    authenticated,
    setAuthenticated,
    fetchCart
  } = useContext(ProductContext)!;
  const router = useRouter();
  const [err, setErr] = useState("");
  const [changePassword, setChangePassword] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/auth/customer/checkAuth`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setAuthenticated(true);
          toast("You are already logged in");
          router.push("/");
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, [setAuthenticated, apiUrl, router]);

  if (authenticated === null) {
    return (
      <div className="auth-loading">
        <Loader size={40} className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  const mergeCart = async (Token: any) => {
    const headers = {
      Authorization: `Bearer ${Token}`,
    };

    try {
      // 1. Get current server cart
      const response = await axios.get(
        `${apiUrl}/api/cart/list`,
        { headers }
      );
      const userCartItems = response.data.cartItems || [];
      
      // 2. Get local cart
      const storedCartList = JSON.parse(localStorage.getItem("localCartList") || "[]") || [];
      
      // 3. Find items in local cart not on server
      const cartItemsToAdd = storedCartList.filter(
        (localItem: any) => !userCartItems.some((serverItem: any) => serverItem._id === localItem._id)
      );

      // 4. Add them to server
      await Promise.all(
        cartItemsToAdd.map((cartItem: any) => 
          axios.post(
            `${apiUrl}/api/cart/add`,
            { productId: cartItem._id },
            { headers }
          )
        )
      );
    } catch (error) {
      console.error("Error merging cart:", error);
    } finally {
      await fetchCart();
      if (typeof window !== "undefined") {
        window.location.href = "/"; // Force refresh to update everything
      }
    }
  };

  function handlePassword() {
    setChangePassword(!changePassword);
  }

  const handleFocus = (field: any) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    function callCheck() {
      setCheck(true);
      setTimeout(() => {
        setCheck(false);
      }, 3000);
    }
    const loginPromise = async () => {
      callCheck();
      const response = await axios.post(
        `${apiUrl}/api/auth/customer/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      localStorage.setItem("token", response.data.token);
      return response;
    };

    toast.promise(loginPromise(), {
      loading: "Logging in...",
      success: (response) => {
        const { success } = response.data;

        if (success) {
          mergeCart(response.data.token);
          setAuthenticated(true);
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
              <div className="forgot-password-link">
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" className="auth-button">
              <span>Sign In</span>
              <LogIn size={18} />
            </button>

            <div className="auth-links">
              <span>New user?</span>
              <Link href="/signup" className="auth-link">
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
