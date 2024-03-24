import { useEffect, useState } from "react";
import axios from "axios"
import { useContext } from 'react';
import { ProductContext } from '../productContext';
import { Link } from "react-router-dom";
import "./sections.css"
import formbg from "../../assets/formbg.webp"

  


export default function Fabrics () {
     const [fabricsList, setFabricsList] = useState([])
     const [isLoading, setIsLoading] = useState(true); // Track loading state
     const [error, setError] = useState(null); // Track errors
const { setShouldFetchCart,mainLoading, setMainLoading } = useContext(ProductContext);
const [cartList, setCartList] = useState([])
// const [initialItems, setInitialItems] = useState([])
// const [cartValue, setCartValue] = useState()



// const cartQuantity = localStorage.getItem("localCartList")


    const handleAddToCart = async (fabric) => {
      const token = localStorage.getItem("authToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
    
      if (!token) {
        return;
      }
    
      const productId = fabric._id;
       
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
      finally{setShouldFetchCart(true)}
    };


    // const handleQuantityChange = (itemId, newQuantity, price) => {
    //   // Validate newQuantity within item limits (optional)
    //   if (newQuantity <= 0) {
    //     return; // Or handle invalid quantity gracefully
    //   }
  
    //   const updatedCart = [...cartList];
    //   const itemIndex = cartList.findIndex((item) => item._id === itemId); // Find item by ID
  
    //   if (itemIndex !== -1) { // Check if item exists
    //     updatedCart[itemIndex].quantity = newQuantity;
    //     updatedCart[itemIndex].price = newQuantity * price;
    //     initialItems[itemIndex].newquantity = newQuantity;
  
    //     localStorage.setItem("localCartList", JSON.stringify(initialItems));
    //     setCartList(updatedCart);
    //   } else {
    //     console.error("Item not found in cart:", itemId); // Handle potential missing item
    //   }
    // };

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


           if (response.data.fabrics && token){
          try{
            const cartResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
              headers: {
                Authorization: `Bearer ${token}`, // Include JWT token with 'Bearer' prefix
              },            
            });
            setCartList(cartResponse.data.cartItems)


      //        if (cartQuantity) {
      //         try {
      //           console.log(JSON.parse(cartQuantity))
      //           setInitialItems(JSON.parse(cartQuantity));
      //         } catch (error) {
      //           console.error("Error parsing local cart data:", error);
      //         }
      //       } else {
      //         // Fetch initial items from API if not in local storage
      //         const initialItemsWithQuantity = cartResponse.data.cartItems.map((item) => ({
      //           ...item,
      //           newquantity: 1, // Adjust default value as needed
      //         }));
      //         setInitialItems(initialItemsWithQuantity);
      //         localStorage.setItem("localCartList", JSON.stringify(initialItemsWithQuantity));
      //       }
    
         }
          
          catch (error) {
            console.error("Error fetching cart data:", error);
          }
        }
        


        
      
      }
        catch (error) {
          if (error.response && error.response.status === 500) {
            setMainLoading(false)
            console.log("empty")
          }
          console.error('Error:', error);
          setError(error.message || 'An error occurred.'); // Provide a user-friendly error message
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
      };
  if(mainLoading == true){
      fetchData();
  }
  else{   
     setIsLoading(false)
    console.log("something is wrong")
    setError("something is wrong")
  }
    }, [handleAddToCart])



    return (
        <div className="product-list-container">
      {isLoading ? (
        <div className="message">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
                    <p className="loading-message">....Getting fabrics</p>
          </div>
      ) : error ? (
        <div className="message">
        <img src={formbg} alt='login background' className='auth-bg-image'/>

        <img className="error-image" src={formbg}/>
        <p className="error-message">Error: {error}</p>
        </div>
      ) : (
        fabricsList.length > 0 ? (              
     <div className="product-list-container">
            {fabricsList.map((fabric, index) => ( 
              <div className="product-list" key={fabric._id}>   
               <Link className="product-link" to={`/${fabric._id}`}>   
                <img src={fabric.image} alt={fabric.name} />
                <div>
                  <p>{fabric.name}</p>  
                  <p>{fabric.tribe}</p>               
                   <p>{fabric.description}</p>
                   <p>Qty:{fabric.quantity} yards</p>
                   <p>Price:{fabric.price} per yard</p>
                </div>
                 </Link>      
                 {/* <select
  className="quantity-input"
  onChange={(e) => handleQuantityChange(fabric._id, parseInt(e.target.value), fabric.price )}
  value={
            // Find corresponding item in initialItems using item._id
            initialItems.find((initialItem) => initialItem._id === fabric._id)?.newquantity || 1
          }>
  {Array.from({ length: fabric.quantity }, (_, i) => i + 1).map((optionValue) => (
    <option key={optionValue} value={optionValue}>
      {optionValue}
    </option>
  ))}
</select> */}
                                 {cartList.some((cartItem) => cartItem._id === fabric._id) ? (
                  <button className="cart-button already-in-cart">Already in Cart</button>
                ) : (
                  <button className="cart-button add-to-cart" onClick={() => handleAddToCart(fabric)}>Add to Cart</button>
                )}              </div>         
            ))} 
            </div>             
        ) : (
          <div className="message">
                    <p className="loading-message">no fabric Found</p>
          </div>
        )
      )}
        </div>
    )
}