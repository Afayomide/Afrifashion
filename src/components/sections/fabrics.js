import { useEffect, useState } from "react";
import axios from "axios"
import { useContext } from 'react';
import { CartContext } from '../cartContext';
import { Link } from "react-router-dom";

  


export default function Fabrics () {
     const [fabricsList, setFabricsList] = useState([])
     const [isLoading, setIsLoading] = useState(false); // Track loading state
     const [error, setError] = useState(null); // Track errors
const { setShouldFetchCart } = useContext(CartContext);

    useEffect(() => {
      const token = localStorage.getItem("authToken")
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fabrics`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include JWT token with 'Bearer' prefix
            },            
          });
  
          setFabricsList(response.data.fabrics);
      }
        catch (error) {
          console.error('Error:', error);
          setError(error.message || 'An error occurred.'); // Provide a user-friendly error message
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
      };
  
      fetchData();
    }, [])

    const handleAddToCart = async (fabric) => {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
    
      if (!token) {
        return;
      }
    
      const productId = fabric._id;
      setShouldFetchCart(true); 
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/add`,
          { productId }, 
          { headers }
        );
    
        console.log('Adding fabric to cart:', response.data); // Handle successful response (optional)
      } catch (error) {
        console.error('Error adding to cart:', error);
        setError('An error occurred while adding to cart.'); // Display user-friendly error
      }
    };


    return (
        <div>
      {isLoading ? (
        <p>Loading fabrics...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        fabricsList.length > 0 ? (              
     <div>
            {fabricsList.map((fabric) => ( 
              <div key={fabric._id}>   
               <Link to={`/${fabric._id}`}>   
                <img src={fabric.image} alt={fabric.name} />
                <p>{fabric.name}</p>
                 </Link>               
                  <button onClick={() => handleAddToCart(fabric)}>Add to Cart</button>
              </div>         
            ))} 
            </div>             
        ) : (
          <p>No fabrics available.</p>
        )
      )}
        </div>
    )
}