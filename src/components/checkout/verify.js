import { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../productContext';
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../../assets/fabricsbg.jpeg"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import "./checkout.css"
import { CiDeliveryTruck } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";





function VerifyPage(){
    const navigate = useNavigate()
  const location = useLocation()
  const reference = new URLSearchParams(location.search).get('reference'); // Extract search term

const { total, setTotal, authenticated, setLocalCartLength, setShouldFetchCart } = useContext(ProductContext);
const [isLoading, setIsLoading] = useState(true); 
  const apiUrl = process.env.REACT_APP_API_URL


useEffect(()=>{
  setTotal(localStorage.getItem("total"))
})




useEffect(() => {
    async function verify() {
      console.log(reference);
try{
      await toast.promise(
        axios.get(`${apiUrl}/api/verify/${reference}`),
        {
          loading: 'Verifying payment...',
          success: 'Payment verified successfully!',
          error: 'Error verifying payment. Please try again.',
        }, 
      );         
      setIsLoading(false)
      setShouldFetchCart(true)
    }

catch (error) {
    console.error('Error verifying payment:', error);
}

    }
    if (reference) {
      verify(); 
    }
    else{
       navigate("/")
       toast.error("no reference")
    }
  }, [reference]);
return(
    <div>
          {isLoading ? (
        <div className="message">
     <AiOutlineLoading3Quarters className='rotate'/>
                    <p className="loading-message">Verifying Your Payment</p>
          </div>
      ) 
      : 
      (<div className='message'>
        <FaCheck className='check'/>
        <p className="success-message">Thank you, payment successful.</p>
        <p className='check-mail'>Kindly check your email for receipts and don't hesitate to contact us anytime</p>
        <small><Link to="/">back to home page</Link></small>
      </div>)
    }
    </div>
)
}

export default VerifyPage