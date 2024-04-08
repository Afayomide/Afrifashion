import React, { useState, useContext } from 'react';
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
          navigate(-1)
          setErr(success)
          setAuthenticated(true)
          console.log(`Login successful. Token: ${token}`);
          setShouldFetchCart(true)
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