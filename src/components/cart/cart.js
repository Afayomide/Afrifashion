import { useEffect, useState } from "react";
import axios from "axios"
import { useContext } from 'react';
import { CartContext } from '../cartContext';
import { Link } from "react-router-dom";

function Cart () {
  const [cartList, setCartList] = useState([])
  const { shouldFetchCart, setShouldFetchCart } = useContext(CartContext);


  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token with 'Bearer' prefix
          },            
        });

        setCartList(response.data.cartItems);
        console.log(response.data.cartItems)
    }
      catch (error) {
        console.error('Error:', error);
      }
    };
        fetchData();
  
  })


  
  
  async function  handleDelete  (item) {
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    if (!token) {
      return;
    }
  
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
  
  {cartList ? (
        <ul>
          {cartList.map((item) => (
            
            <div key={item._id}>
            <Link to={`/${item._id}`}>
            <img src={item.image}/>
            <p>{item.name}</p>
            </Link>
            <button onClick={() => handleDelete(item)}>Remove From Cart</button>
            </div>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

        </div>
      )
}
export default Cart