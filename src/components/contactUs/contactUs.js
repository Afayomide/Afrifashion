import "./contact.css"
import { useState, useEffect } from "react"
import axios from "axios"
import {toast} from "react-hot-toast"


export default function ContactUs () {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [subject, setSubject] = useState("")
    const apiUrl = process.env.REACT_APP_API_URL



    function sendEmail(e) {
        e.preventDefault();
    
        const emailPromise = axios.post(`${apiUrl}/api/contactUs`, {
            subject,
            fullName,
            email,
            message
        });
    
        toast.promise(
            emailPromise,
            {
                loading: 'Sending message...',
                success: 'Message sent successfully!',
                error: 'Error sending email. Please try again.'
            }
        );
    
        emailPromise.then(() => {
            setEmail("")
            setMessage("")
            setFullName("")
            setSubject("")
        });
    }


    return(
        <div className="contact-us">
             <form className='contact-us-form' onSubmit={sendEmail}>
      <h3>Please contact us on any issue or special Order</h3> 

      
      <div className='contact-form-input'>
          <input className={`input-field`} 
          type="text"
           id='subject' 
           onChange={(e) => setSubject(e.target.value)}
           value={subject}
             placeholder='subject'   
             required
            /> <br/>
      </div>

      <div className='contact-form-input'>
          <input className={`input-field`} 
          type="text"
           id='username' 
           onChange={(e) => setFullName(e.target.value)}
           value={fullName}
             placeholder='Full Name'   
             required
            /> <br/>
      </div>
      
      <div className='contact-form-input'>
          <input className={`input-field`}
           type="email" 
           id='email' 
           onChange={(e) => setEmail(e.target.value)}
           value={email}
             placeholder='email' 
             required  
            /> <br/>
      </div>

        
       <div className='contact-form-input'>
          <textarea className={`input-field textarea`} 
          placeholder='message'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          required
          >
          </textarea><br/>
        </div>
        <button type="submit">contact</button>

      </form>
      
        </div>
    )
}