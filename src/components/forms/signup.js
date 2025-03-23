import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./form.css";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { ProductContext } from "../productContext";
import { toast } from "react-hot-toast";

export default function Signup() {
  const [check, setCheck] = useState(false);
  const { authenticated } = useContext(ProductContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [specialChar, setNoSpecialChar] = useState(false)
  const [changePassword, setChangePassword] = useState(true);
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
      if (specialChar){
      const response = await axios.post(serverUrl, {
        fullname,
        username,
        email,
        password,
      });

      const { success } = response.data;

      if (success) {
        navigate("/login");
        console.log(response.data);
        setErr(response.data.message);
      } else {
        console.error(response.data.message);
        setErr(response.data.message);
      }
    }
    else{
      toast.error("add special character to password")
    }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* <img className='auth-bg-image' src={formbg} alt='login background'/> */}

      <form className="auth-form" onSubmit={handleSignup}>
        <h3>Signup</h3>
        <div className="orange">
          {check == true ? "checking your details....." : ""}
        </div>
        <div className="error">{err}</div>

        <div className="auth-form-input">
          {/* <label htmlFor="username">
            Username:
          </label> */}
          <input
            className="input-field"
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setErr("");
              setUsername(e.target.value);
            }}
            placeholder="username"
          />
        </div>

        {/* <input className='input-field' type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} /> */}
        <div className="auth-form-input">
          {/* <label htmlFor="fullname">
            Fullname:
          </label> */}
          <input
            className="input-field"
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => {
              setErr("");
              setFullname(e.target.value);
            }}
            placeholder="fulname"
          />
        </div>

        <div className="auth-form-input">
          {/* <label htmlFor="email">
            Email:
          </label> */}
          <input
            className="input-field"
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setErr("");
              setEmail(e.target.value);
            }}
            placeholder="email"
          />
        </div>

        <div className="auth-form-input">
          {/* <label htmlFor="password">
            Password:
  
          </label>         */}            
          <div>

          <div className="pwd-input-icons">
            <div className="pwd-icons" onClick={handlePassword}>
              {" "}
              {changePassword ? (
                <BsEyeFill className="eye" />
              ) : (
                <BsEyeSlashFill className="eye" />
              )}
            </div>
            
            <input
              className="pwd-input-field input-field"
              type={changePassword ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => {                
               if (e.target.value.length > 20) {
                e.target.value = "" 
                toast.error("password is too long")
               } 
               else{
                setPassword(e.target.value);
               };
               if (!containsSpecialCharacter(e.target.value)) {
                setNoSpecialChar(false)
            } else {
              setNoSpecialChar(true)
            }
                setErr("");
              }}
              placeholder="password"
            /> </div> {specialChar ? null : <small className="red">password should contain at least one special character</small>}

          </div>      
        </div>

        <button type="submit">Submit</button>
        <small>
          existing user? {" "}
          <Link to="/login" className="form-small-link">
            {" "}
            login{" "}
          </Link>
        </small>
      </form>
    </div>
  );
}
