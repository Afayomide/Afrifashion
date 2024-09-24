import { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../productContext';
import bgImage from "../../assets/fabricsbg.jpeg"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import "./checkout.css"
import { CiDeliveryTruck } from "react-icons/ci";
import Select from 'react-select';
import { Country, State } from 'country-state-city';  // Import functions to fetch countries and states


function CheckoutPage(){
const { total, setTotal, authenticated, initialItems} = useContext(ProductContext);

  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const apiUrl = process.env.REACT_APP_API_URL
  const countries = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);



useEffect(()=>{
  setTotal(localStorage.getItem("total"))
})

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



// Handle country selection and fetch states for the selected country
const handleCountryChange = (selectedOption) => {
  setSelectedCountry(selectedOption);
  const countryIsoCode = selectedOption.value;
  const statesList = State.getStatesOfCountry(countryIsoCode).map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));
  setStates(statesList);  // Populate states based on country
  setSelectedState(null);  // Reset state when country changes
};

// Handle state selection
const handleStateChange = (selectedOption) => {
  setSelectedState(selectedOption);
};



  const handlePayment = async (e) => {

    e.preventDefault();
    const localCartList = JSON.parse(localStorage.getItem("localCartList")) || [];
    console.log(localCartList)
    const clothesData= localCartList.map(item =>({
        clothesId: item._id,
        quantity: item.newquantity,
        amount: item.price 
    }));
    try {
      const response = await axios.post(`${apiUrl}/api/pay`, {
        email,
        fullName,
        amount : total,
        clothesData, 
        redirectUrl : `${process.env.REACT_APP_URL}/verify`,
        selectedCountry, 
        selectedState,
        address
      });

      if (response.data.status === 'success') {
        console.log(response.data)
        console.log("success")
        window.location.href = response.data.data.authorization_url;
      } else {
        toast.error('Payment initialization failed.');
      }

    } catch (error) {
      toast.error('Error initializing payment');
    }
  };

return(
    <div className='checkout'>
                {authenticated ? 
                <div className='checkout-container'>
<div className='checkout-form-container'>
 <form className='checkout-form' onSubmit={handlePayment}>      
  <div className='checkout-form-details'>
    <h5 className="checkout-total">Your Total: <span>${total}</span></h5>
     <small>Working with DHL<span><CiDeliveryTruck/></span>,  no matter where you are, we can ship to you.</small>
      <h3>Enter your details for delivery</h3> 
  </div>
      <div className='checkout-form-input'>
          <input className={`input-field`} 
          type="text"
           id='username' 
           onChange={(e) => setFullName(e.target.value)}
           value={fullName}
             placeholder='Full Name'   
             required
            /> <br/>
      </div>
      
      <div className='checkout-form-input'>
          <input className={`input-field`}
           type="email" 
           id='email' 
           onChange={(e) => setEmail(e.target.value)}
           value={email}
             placeholder='email address' 
             required  
            /> <br/>
      </div>

      <div className='checkout-form-input'>
          <input className={`input-field`}
           type="phone" 
           id='phone' 
           onChange={(e) => setPhone(e.target.value)}
           value={phone}
             placeholder='phone number'  
             required 
            /> <br/>
      </div>

      <div className='checkout-form-input'>
        <label>Select Country</label>
      <Select
        options={countries}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder="Select a country"
        isSearchable
        required
      />
    </div>


<div className='checkout-form-input'>
<label>Select State</label>
      <Select
        options={states}
        value={selectedState}
        onChange={handleStateChange}
        placeholder="Select a state/province"
        isSearchable
        isDisabled={!selectedCountry}
        required
      />
</div>
        
       <div className='checkout-form-input'>
       <label>Delivery Address</label>
          <textarea className={`input-field text-area`} 
          placeholder='address'
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          required
          >
          </textarea><br/>
        </div>
        <br />     
        <button  type="submit">Pay</button>

      </form>
      </div>

      <div className='order-summary'>
        <h3>Order Summary</h3>
      {initialItems.map((item, index) => ( 
            <div className="summary-item" key={item._id}>
              <div className="about-summary-item">
              <Link className="summary-item-link" to={`/${item._id}`}>
                <img src={item.image} alt={item.name} />       
                </Link>
                <div className="summary-item-description">
                  <p><span className="description-header">Material:</span> {item.type}</p>
              
              <div className="summary-item-quantity">
              <p><span className="description-header">Quantity:</span>{item.newquantity}</p>
              
              {initialItems[index]?.name == "fabric" ? (initialItems[index]?.newquantity == 1 ? (<small>yard</small>) : <small>yards</small>) : "" }
              </div> 
              <p><span className="description-header">Total:</span> ${item.price}</p>
              </div>
              </div>
              
              
            </div>
          ))}                 
      </div>
                </div>
                      : <div className="no-cart">
          <p>Please <Link to="/login">Login</Link> Or <Link to="/signup">Sign Up</Link> to checkout.</p>
        </div>}       
    </div>
)
}

export default CheckoutPage