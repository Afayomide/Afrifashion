import { useEffect } from "react";
import axios from "axios"

function Cart () {
    var length 
    

    useEffect(() => {
  const token = localStorage.getItem("authToken")
        const fetchData = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
              headers: {
                Authorization: `Bearer ${token}`, // Include JWT token with 'Bearer' prefix
              },            
            });

            length = response.data.cartLength
            console.log(response.data.cartLength)
        }
          catch (error) {
            console.error('Error:', error);
          }
        };
  
        fetchData();
      },[]);

      return(
        <div>
            {length}
        </div>
      )
}
export default Cart