import { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../productContext';
import { usePaystackPayment } from "react-paystack";
import bgImage from "../../assets/fabricsbg.jpeg"
import { Link } from 'react-router-dom';
import "./checkout.css"
import { CiDeliveryTruck } from "react-icons/ci";
import { GiDeliveryDrone } from 'react-icons/gi';



function CheckoutPage(){
  const publicKey = "pk_test_92549e9f5f279539fd738adbad7ca5c4efa207ea";
  const [disable, setDisable] = useState()
const { total, setTotal } = useContext(ProductContext);
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const token = localStorage.getItem("authToken");
  const [nameWarning, setNameWarning] = useState()
  const [phoneWarning, setPhoneWarning] = useState()
  const [emailWarning, setEmailWarning] = useState()
  const[addressWarning, setAddressWarning] = useState()


useEffect(()=>{
  setTotal(localStorage.getItem("total"))
})
  const amount = total + '00'
  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount,
    publicKey,
};

var localEmail = localStorage.getItem('email')
var localName = localStorage.getItem('fullname')



useEffect(() => {
if (localEmail){
  setEmail(localEmail) 

}
if(localName){
  setFullName(localName)   
}
},[])



const onSuccess = () => {
    console.log("Success")
    // emailjs.sendForm('service_yyeo66h', 'template_e3plaus', form.current, '-uGNesM2dn2b2lqIY')
    // localStorage.removeItem("item");
    // ToggleData()
    // setItems([])
  };
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
  }


  const PaystackHookButton = () => {
    const initializePayment = usePaystackPayment(config);
function flashWarning(e) {
  if(fullName == "") {
    setNameWarning('warning')
  }
  if(phone == ""){
    setPhoneWarning("warning")
  }
  if(phone !==""){
    setPhoneWarning("")
  }
  if(email == ""){
    setEmailWarning("warning")
  }
  if(email !==""){
    setEmailWarning("")
  }
 
 
  if( address == "") {
    setAddressWarning("warning")
  }
  if(address !==  ""){
    setAddressWarning("")
  }
  if(phone !== ""  && email !=="" && fullName !=="" && address!== ""){
      initializePayment(onSuccess, onClose)

  }
}

    return (
      <div>
        <button className="checkout-button" disabled={disable} type="button" onClick={() => {
            flashWarning()
          }}>Checkout</button> 
   
          
      </div>
    );
};
return(
    <div>
                      <img className="cart-bg-image" src={bgImage} alt="backgroundImage"/>
                {token ? 
                <div>
      <h3 className="cart-total"><span>Your Total: </span>${total}</h3>

 <form className='checkout-form' >
     <small>Working with DHL<span><CiDeliveryTruck/></span>,  No matter where you are, we can ship to you.</small>
      <h3>Enter Your details for delivery</h3> 

      <div className='checkout-form-input'>
          <input className={`${nameWarning} input-field`} 
          type="text"
           id='username' 
           onChange={(e) => setFullName(e.target.value)}
           value={fullName}
             placeholder='Full Name'   
            /> <br/>
              {nameWarning == "warning" ? <small className="warning-text"> please fill this field </small> : ""}
      </div>
      
      <div className='checkout-form-input'>
          <input className={`${emailWarning} input-field`}
           type="email" 
           id='email' 
           onChange={(e) => setEmail(e.target.value)}
           value={email}
             placeholder='email address'   
            /> <br/>
                  {emailWarning == "warning" ? <small className="warning-text"> please fill this field </small> : ""}
      </div>

      <div className='checkout-form-input'>
          <input className={`${phoneWarning} input-field`}
           type="phone" 
           id='phone' 
           onChange={(e) => setPhone(e.target.value)}
           value={phone}
             placeholder='phone number'   
            /> <br/>
            {phoneWarning == "warning" ? <small className="warning-text"> please fill this field </small> : ""}
      </div>
        
       <div className='checkout-form-input'>
          <textarea className={`${addressWarning} input-field`} 
          placeholder='address'
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          >
          </textarea><br/>
          {addressWarning == "warning" ? <small className="warning-text"> please fill this field </small> : ""}
        </div>
        <br />     
        <PaystackHookButton type="submit"/>

      </form>
                </div>
                      : <div className="no-cart">
          <p>Please <Link to="/login">Login</Link> Or <Link to="/signup">Sign Up</Link> to checkout.</p>
        </div>}       
    </div>
)
}

export default CheckoutPage