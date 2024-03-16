import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './form.css';
import { BsEyeFill } from 'react-icons/bs';
import { BsEyeSlashFill } from 'react-icons/bs';
import formbg from '../../assets/formbg.webp'



export default function Signup () {
    const[check, setCheck] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
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
    
    const navigate = useNavigate();
  
    const handleSignup = async (e) => {
      e.preventDefault();
      function callCheck(){
        setCheck(true);
        setTimeout(() => {
          setCheck(false);
        }, 3000);
      }
  
      const serverUrl = `${process.env.REACT_APP_API_URL}/api/signup`;
  
      try {
        callCheck()
        const response = await axios.post(serverUrl, {
          fullname,
          username,
          email,
          password,
        });
  
        const {success} = response.data;
  
        if (success) {
          navigate('/login');
          console.log(response.data)
          setErr(response.data.message)
        } else {
          console.error(response.data.message);
          setErr(response.data.message)
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <div >
         <img className='auth-bg-image' src={formbg} alt='login background'/>

        <form className='auth-form' onSubmit={handleSignup}>
          <h3>Signup</h3>
          <div className='orange'>{check == true ? "checking your details....." : ""}</div>
          <div className='error'>
                  {err} 
          </div>

          <div className='auth-form-input'>
   {/* <label htmlFor="username">
            Username:
          </label> */}
          <input className='input-field' type="text" id='username' value={username} onChange={(e) => {
            setErr("")
            setUsername(e.target.value)}} 
                placeholder='username'
            />
          </div>
       
        
         
          {/* <input className='input-field' type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} /> */}
  <div className='auth-form-input'>
  {/* <label htmlFor="fullname">
            Fullname:
          </label> */}
          <input className='input-field' type="text" id="fullname" value={fullname} onChange={(e) => {
            setErr("")
            setFullname(e.target.value)}}
            placeholder='fulname' />
  </div>
        
          <div className='auth-form-input'>
            {/* <label htmlFor="email">
            Email:
          </label> */}
          <input className='input-field' type="email" id='email' value={email} onChange={(e) => {
            setErr("")
            setEmail(e.target.value)}}
            placeholder='email'
             />  
          </div>
        
        
        <div className='auth-form-input'>
            {/* <label htmlFor="password">
            Password:
  
          </label>         */}
          <div className='pwd-input-icons'> 
            <div className='pwd-icons' onClick={handlePassword}>  {changePassword ? <BsEyeFill className='eye'/> : <BsEyeSlashFill className='eye'/>}</div>
                   <input className='pwd-input-field input-field' type={changePassword ? "password" : "text"} id='password' value={password} onChange={(e) => {
                    setErr("")
                    setPassword(e.target.value)}} 
                        placeholder='password'
                    />        
           </div>     
        </div>  
     
          <button type="submit">Signup</button>
        </form>
      </div>
    );
}