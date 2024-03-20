import { useEffect, useState } from "react";
import axios from "axios"


function Cart () {
  const [cartList, setCartList] = useState([])

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
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/delete`,
        { productId }, 
        { headers }
      );
  
      console.log('Deleting item from cart:', response.data); // Handle successful response (optional)
    } catch (error) {
      console.error('Error deleting from cart:', error);
    }
  }
      return(
        <div className="topmargin">
  
  {cartList ? (
        <ul>
          {cartList.map((item) => (
            <div key={item._id}>
            <img src={item.image}/>
            <p>{item.name}</p>
            <button onClick={() => handleDelete(item)}>Delete</button>
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