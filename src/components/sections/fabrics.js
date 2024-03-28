import { useEffect, useState,memo } from "react";
import axios from "axios"
import { useContext } from 'react';
import { ProductContext } from '../productContext';
import { Link } from "react-router-dom";
import "./sections.css"
import formbg from "../../assets/formbg.webp"

  


const Fabrics = memo(() => { 
  const [fabricsList, setFabricsList] = useState([])
     const [isLoading, setIsLoading] = useState(true); 
     const [error, setError] = useState(null); 
const { cartNo, setCartNo, setShouldFetchCart,mainLoading, setMainLoading, setLocalCartLength } = useContext(ProductContext);
const [cartList, setCartList] = useState([])
const [buttonType, setButtonType] = useState("add To Cart")


// const handleAddToCart = async (fabric) => {
//   const token = localStorage.getItem("authToken");
//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };


//   if (!token) {
//     const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
//     const fabricId = fabric._id;
//     const isFabricInCart = storedCartList.some(item => item._id === fabricId);

//     if (!isFabricInCart) {
//         const fabricWithQuantity = { ...fabric, newQuantity: 1 }; // Add newQuantity field with default value 1
//         storedCartList.push(fabricWithQuantity);
//         localStorage.setItem('localCartList', JSON.stringify(storedCartList));
//         const localCart = JSON.parse(localStorage.getItem('localCartList'))
//         setLocalCartLength(localCart.length)
//         console.log(storedCartList);

//     }
//     else{
//       console.log("already in cart")
//     }
// }
//   else{

//   const productId = fabric._id;
   
//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/api/cart/add`,
//       { productId }, 
//       { headers }
//     );

//     console.log('Adding fabric to cart:', response.data); // Handle successful response (optional)

//     // If addition to the cart on the server was successful, update storedCartList
//     const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
//     const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
//     storedCartList.push(fabricWithQuantity);
//     localStorage.setItem('localCartList', JSON.stringify(storedCartList));
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     setError('An error occurred while adding to cart.'); // Display user-friendly error
//   }
//   finally {
//     setShouldFetchCart(true);
//   }
// }
// };

const handleAddToCart = async (fabric) => {
  const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
   // Add fabric to local cart
    const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
    storedCartList.push(fabricWithQuantity);
    localStorage.setItem('localCartList', JSON.stringify(storedCartList));
    console.log('Added fabric to local cart:', fabric);

    // Update cart count (optional)
    setLocalCartLength(storedCartList.length);
    setCartNo(storedCartList.length)

    const token = localStorage.getItem("authToken");

    if (token){
  try {
 

    // Add fabric to server cart
    const token = localStorage.getItem("authToken");
    if (token) {}
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (!token) {
      throw new Error("User not authenticated");
    }

    const productId = fabric._id;
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/cart/add`,
      { productId }, 
      { headers }
    );

    console.log('Added fabric to server cart:', response.data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    setError('An error occurred while adding to cart.');

    // Remove the item from local cart list if adding to server was not successful
    const updatedCartList = storedCartList.filter(item => item._id !== fabric._id);
    localStorage.setItem('localCartList', JSON.stringify(updatedCartList));
    console.log('Removed fabric from local cart:', fabric);
  } finally {
    setShouldFetchCart(true); // Trigger cart fetch after adding to server
  }
}
};




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
                  <p>type: {fabric.name}</p>  
                   <p>{fabric.description}</p>
                   <p>Qty:{fabric.quantity} yards</p>
                   <p>Price:{fabric.price} per yard</p>
                </div>
                 </Link>      
        
                 {cartList.some((cartItem) => cartItem._id === fabric._id) || (JSON.parse(localStorage.getItem('localCartList')) || []).some((storedCartItem) => storedCartItem._id === fabric._id) ? (
    <button className="cart-button already-in-cart">Already in Cart</button>
) : (
    <button className="cart-button add-to-cart" onClick={() => handleAddToCart(fabric)}>Add to Cart</button>
)}</div>         
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
})

export default Fabrics;
