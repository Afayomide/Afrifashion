

import { useEffect, useState } from "react";
import axios from "axios"
import { useContext } from 'react';
import { ProductContext } from '../productContext';
import { Link } from "react-router-dom";
import "./cart.css"

function Cart () {
  const [cartList, setCartList] = useState([])
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const { shouldFetchCart, setShouldFetchCart,mainLoading, setMainLoading } = useContext(ProductContext);
  const [price, setPrice] = useState("")
  const [initialItems, setInitialItems] = useState([])
  const [error, setError] = useState(null); // Track errors
  var total
    const token = localStorage.getItem("authToken")



  useEffect(() => {
    const cartQuantity = localStorage.getItem("localCartList")
    const fetchData = async () => {
      if (token && mainLoading == true){
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token with 'Bearer' prefix
          },            
        });

        setCartList(response.data.cartItems);
      if (cartQuantity){
        console.log(JSON.parse(cartQuantity))
        setInitialItems(JSON.parse(cartQuantity));
      }
      else{
        const initialItemsWithQuantity = response.data.cartItems.map((item) => ({
          ...item, // Spread existing item properties
          newquantity: 1, // Add 'newquantity' with default value (adjust as needed)
        }));
        setInitialItems(initialItemsWithQuantity);
        localStorage.setItem("localCartList", JSON.stringify(initialItemsWithQuantity))
        console.log(initialItemsWithQuantity)
      }
    }
      catch (error) {
        setError(error.message || 'An error occurred.');  
        console.error('Error:', error);
      }
      finally{
        setIsLoading(false)
      }
    }
    else if (!token){
      setIsLoading(false)
    }
    else{
      setError("something is wrong")
    }
  }
  
        fetchData();
        setShouldFetchCart(false)
  
  }, [shouldFetchCart])

 if(cartList != []){
          total = cartList.reduce((accumulator,obj) =>{
               return accumulator + obj.price;
               }, 0)
       }
       else{
          total = 0
       }

  const handleQuantityChange = (itemIndex, newQuantity, price) => {
    // Validate newQuantity within item limits (optional)
    console.log(itemIndex)
    const updatedCart = [...cartList];
    updatedCart[itemIndex].quantity = newQuantity;
    updatedCart[itemIndex].price = newQuantity * [...initialItems][itemIndex].price;
    [...initialItems][itemIndex].newquantity = newQuantity
    console.log(initialItems)
    localStorage.setItem("localCartList", JSON.stringify(initialItems))
    setCartList(updatedCart);
    console.log([...initialItems][itemIndex].newquantity)
  };
  
  async function  handleDelete  (item) {
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
  
    const productId = item._id;
    try {
      const fetchUrl = `${process.env.REACT_APP_API_URL}/api/cart/delete`;
    
      fetch(fetchUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
          'Content-Type': 'application/json' // Optional, but recommended for DELETE requests with a body
        },
        body: JSON.stringify({ productId }) // Include product ID in the request body
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error deleting from cart: ${response.statusText}`);
        }
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        console.log('Deleting item from cart:', data); // Handle successful deletion (optional)
        setShouldFetchCart(true); 
        setInterval(()=>{
          setShouldFetchCart(false)
        }, 10)
      })
      .catch(error => {
        console.error('Error deleting from cart:', error);
      });
    } catch (error) {
      console.error('Error deleting from cart (during fetch):', error);
    }
  }
      return(
        <div className="topmargin">
        
  <h3 className="cart-total"><span>Your Total: </span>₦{total}</h3>

{isLoading ? 
(
  <div className="message">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
                    <p className="loading-message">....Getting Your Cart Items</p>
          </div>
      )
       :
  error ?
  (
        <div className="message">
        <p className="error-message">Error: {error}</p>
        </div>
      ) : 
  cartList.length < 1  && token ? (
 <p>Your cart is empty.</p>
      ) 
      : 
      token ?           <div className="cart-list-container">
          {cartList.map((item, index) => (
            
            <div className="cartlist" key={item._id}>
            <Link className="cartlist-link" to={`/${item._id}`}>
    
    
            <img src={item.image}/>
    
    
            <div>
               <p>{item.name}</p>
            <p>{item.tribe}</p>
            <p>Price: {item.price}</p> 
            </div>
    
            </Link>
            <select
    className="quantity-input"
    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
    value={initialItems[index]?.newquantity || 1} // Set initial value
    >
    {Array.from({ length: [...initialItems][index].quantity }, (_, i) => i + 1).map((optionValue) => (
    <option key={optionValue} value={optionValue}>
      {optionValue}
    </option>
    ))}
    </select>
            <button className="remove-item-button" onClick={() => handleDelete(item)}>Remove</button>
            </div>
          ))}
        </div> : <div className="no-cart"> 
      <p>Please <Link to="/login">Login</Link> Or <Link to="/signup">Sign Up</Link> to view cart Items </p>
       </div> 
     
      
}
        </div>
      )
}
export default Cart





