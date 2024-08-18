import React, { useState, useContext, useEffect } from 'react';
import "./form.css"
import { useNavigate, Link } from "react-router-dom";
import { BsEyeFill } from 'react-icons/bs';
import { BsEyeSlashFill } from 'react-icons/bs';
import axios from 'axios';
import formbg from '../../assets/formbg.webp'
import { ProductContext } from '../productContext';
    const authToken = localStorage.getItem("authToken");





export default function Login () {
    const [check, setCheck] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {authenticated, setAuthenticated, setShouldFetchCart, setLocalCartLength} = useContext(ProductContext)
    const navigate = useNavigate();
    const [err, setErr] = useState("")
    const [changePassword, setChangePassword] = useState(true);

    useEffect(
      () => {
        const authToken = localStorage.getItem('authToken')
        if(authToken){
          navigate("/");
        }
      },[authenticated]
    )

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
              if(changePassword == true){
                setChangePassword(false)
              }
             if(changePassword == false) {
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
        try {
          callCheck()
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
            username,
            password,
          });
          const token = response.data.token
          const { success } = response.data;

        if (success) {         
          localStorage.setItem('authToken', token); 
          setErr(success)
          console.log(`Login successful. Token: ${token}`);
          fetchData(token)
        } else {
          console.error('Login failed:', response.data.message);
   setErr(response.data.message)
        }
      } 
  
      catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    return (
      <div >
   <img src={formbg} alt='login background' className='auth-bg-image'/>
      <form className='auth-form' onSubmit={handleLogin}>
      <h3>Login</h3> 
      <div className='orange'>{check == true ? "checking your details....." : ""}</div>
      <div className='error'>{err} </div>
      <div className='auth-form-input'>
    
          <input className='input-field' type="text" id='username' value={username} onChange={(e) => {
            setErr("")
            setUsername(e.target.value)}} 
             placeholder='username'   
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