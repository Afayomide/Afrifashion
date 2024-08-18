import { useEffect, useState,memo } from "react";
import axios from "axios"
import { useContext } from 'react';
import { ProductContext } from '../productContext';
import { Link } from "react-router-dom";
import "./sections.css"
import formbg from "../../assets/formbg.webp"
import bgImage from "../../assets/fabricsbg.jpeg"
import { click } from "@testing-library/user-event/dist/click";




const Fabrics = memo(() => { 
  const [fabricsList, setFabricsList] = useState([])
     const [isLoading, setIsLoading] = useState(true); 
     const [error, setError] = useState(null); 
const { cartNo, setCartNo, setShouldFetchCart,mainLoading, setMainLoading, setLocalCartLength, cartList, setCartList } = useContext(ProductContext);
const [buttonType, setButtonType] = useState("add To Cart")


const handleAddToCart = async (fabric) => {
  const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
    const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
    storedCartList.push(fabricWithQuantity);
    localStorage.setItem('localCartList', JSON.stringify(storedCartList));
    console.log('Added fabric to local cart:', fabric);

    setLocalCartLength(storedCartList.length);
    setCartNo(storedCartList.length)

    const token = localStorage.getItem("authToken");

    if (token){
  try {
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

    const updatedCartList = storedCartList.filter(item => item._id !== fabric._id);
    localStorage.setItem('localCartList', JSON.stringify(updatedCartList));
    console.log('Removed fabric from local cart:', fabric);
  } finally {
    setShouldFetchCart(true); 
  }
}
};


function localClickedList(fabric) {
  const clickedList = JSON.parse(localStorage.getItem('localClickedList')) || [];
  const clickedItemId = clickedList.find(item => item._id === fabric._id); // Assuming 'id' is unique for each fabric
  if (clickedItemId) {
      console.log("already in")
  } else {
      const clickedItem = { ...fabric, newquantity: 1 }; 
      clickedList.push(clickedItem);
      console.log(clickedItem)
      console.log("not in")
  }
  localStorage.setItem('localClickedList', JSON.stringify(clickedList));
  console.log(clickedList);
}



    useEffect(() => {
      const token = localStorage.getItem("authToken")
      const fetchData = async () => {
        try { 
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fabrics`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },            
          });
  
          setFabricsList(response.data.fabrics);


           if (response.data.fabrics && token){
          try{
            const cartResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
              headers: {
                Authorization: `Bearer ${token}`,
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
          setError(error.message || 'An error occurred.'); 
      } finally {
        setIsLoading(false);
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
                  {/* <img className="fabrics-bg-image" src={bgImage} alt="backgroundImage"/> */}
      {isLoading ? (
        <div className="message">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
                    <p className="loading-message">....Getting all fabrics</p>
          </div>
      ) 
      : 
      error ? 
      (
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
               <Link onClick={()=> localClickedList(fabric)} className="product-link" to={`/${fabric._id}`}>   
                <img src={fabric.image} alt={fabric.name} />
                <div className="product-link-texts">
                  <p>{fabric.type}</p>  
                   <p>{fabric.description}</p>
                   <p><span>${fabric.price}</span> per yard</p>
                   <p><span>{fabric.quantity} yards</span> left</p>
                </div>
                 </Link>      
        
                 {cartList.some((cartItem) => cartItem._id === fabric._id) || (JSON.parse(localStorage.getItem('localCartList')) || []).some((storedCartItem) => storedCartItem._id === fabric._id) ? (
    <button className="cart-button already-in-cart">Added To Cart</button>
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
