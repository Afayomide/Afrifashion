import React, { useState, useContext, useEffect } from 'react';
import "./form.css"
import { useNavigate, Link } from "react-router-dom";
import { BsEyeFill } from 'react-icons/bs';
import { BsEyeSlashFill } from 'react-icons/bs';
import axios from 'axios';
import formbg from '../../assets/formbg.webp'
import { ProductContext } from '../productContext';
import {toast} from 'react-hot-toast';



export default function Login () {
    const [check, setCheck] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {authenticated, setAuthenticated, setShouldFetchCart, setLocalCartLength} = useContext(ProductContext)
    const navigate = useNavigate();
    const [err, setErr] = useState("")
    const [changePassword, setChangePassword] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL


    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/auth/customer/checkAuth`, {
            withCredentials: true
          });
  
          if (response.status === 200) {
            setAuthenticated(true)
            toast("You are already logged in");
            navigate("../")
          } else {
            setAuthenticated(false)
          }
        } catch (error) {
          setAuthenticated(false);
          console.log(error)
        }
      };
  
      checkAuth();
    }, []);

    if (authenticated === null) {
      return <p>Loading...</p>; // Or a spinner/loading component
    }
  

    const fetchData = async (Token) => {
      const headers = {
        Authorization: `Bearer ${Token}`,
      };

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
          headers,
        });
        const userCartItems = await response.data.cartItems;
        const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
        const cartItemsToAdd = storedCartList.filter(item => !userCartItems.some(userItem => userItem._id === item._id));

        await Promise.all(cartItemsToAdd.map(async cartItem => {
          const existingItem = userCartItems.find(item => item._id === cartItem._id);

          if(!existingItem){
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/cart/add`,
            { productId: cartItem._id },
            { headers }
          );       
             console.log('Added item to user cart:', response.data);
        }
        else{
          console.log("already exists")
        }
        }));
        
      } catch (error) {
        console.log(error)
      }      
      finally{           
        setShouldFetchCart(true)         
        setAuthenticated(true)
        window.location.reload()     
      }      

    }

          function handlePassword() {
              if(changePassword === true){
                setChangePassword(false)
              }
             if(changePassword === false) {
              setChangePassword(true)
             }
          }    
          
      const handleLogin = async (e) => { 
    e.preventDefault()
    function callCheck(){
      setCheck(true);
      setTimeout(() => {
        setCheck(false);
      }, 3000);
    }
    const loginPromise = async () => {
      callCheck()
      const response = await axios.post(`${apiUrl}/api/auth/customer/login`, {
        email,
        password
      });

      return response;
    };

    toast.promise(loginPromise(), {
      loading: 'Logging in...',
      success: (response) => {
        console.log(response);
        const { success } = response.data;

        if (success) {
           fetchData()
          setAuthenticated(true);
          navigate('/');
          return 'Login successful!';          
        } else {
          throw new Error(response.data.message);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        return error.message || 'An error occurred';
      }
    });
    };
  
    return (
      <div >
   {/* <img src={formbg} alt='login background' className='auth-bg-image'/> */}
      <form className='auth-form' onSubmit={handleLogin}>
      <h3>Login</h3> 
      <div className='orange'>{check === true ? "checking your details....." : ""}</div>
      <div className='error'>{err} </div>
      <div className='auth-form-input'>
    
          <input className='input-field' type="text" id='email' value={email} onChange={(e) => {
            setErr("")
            setEmail(e.target.value)}} 
             placeholder='email'   
            /> 
      </div>
        
       <div className='auth-form-input'>
         
           <div className='pwd-input-icons'>
                   <input className='pwd-input-field input-field' type={changePassword ? "password" : "text"} id='password' value={password} onChange={(e) => {
                    setErr("")
                    setPassword(e.target.value)}}
                    placeholder="password"
                     />             <div className='pwd-icons' onClick={handlePassword}> {changePassword ? <BsEyeFill className='eye'/> : <BsEyeSlashFill className='eye'/>}</div>
     
       </div>
        
  
           </div>
        <br />
        <button type="submit">submit</button>   
           <small>New user? <Link className="form-small-link" to="/signup">sign Up</Link></small>
      </form>
      </div>
    );
}