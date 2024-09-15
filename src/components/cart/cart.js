import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from 'react';
import { ProductContext } from '../productContext';
import { Link } from "react-router-dom";
import "./cart.css";
import bgImage from "../../assets/fabricsbg.jpeg"




console.log(JSON.parse(localStorage.getItem('localCartList')))

function Cart () {
  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {initialItems, setInitialItems, shouldFetchCart, setShouldFetchCart, mainLoading, setMainLoading, setLocalCartLength, total, setTotal } = useContext(ProductContext);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");


function arraysHaveSameItemsById(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort((a, b) => a.id - b.id);
  const sortedArr2 = arr2.slice().sort((a, b) => a.id - b.id);

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i].id !== sortedArr2[i].id) {
      return false; 
    }
  }

  return true;
}
  useEffect(() => {
    const fetchData = async () => {
      if (token && mainLoading) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setCartList(response.data.cartItems);

          const storedCartList = JSON.parse(localStorage.getItem('localCartList'));
          const userCartItems = await response.data.cartItems;

          
          if (storedCartList && arraysHaveSameItemsById(storedCartList, userCartItems)) {
            setInitialItems(storedCartList);
          } else {
            const initialItemsWithQuantity = response.data.cartItems.map((item) => ({
              ...item,
              newquantity: 1,
            }));
            setInitialItems(initialItemsWithQuantity);
            localStorage.setItem("localCartList", JSON.stringify(initialItemsWithQuantity));
          }
        } catch (error) {
          
          if (error.response && error.response.status === 500) {
            setMainLoading(false);
          }
          setError(error.message || 'An error occurred.');
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
    setShouldFetchCart(false);
  }, [shouldFetchCart, mainLoading, setMainLoading, setShouldFetchCart, token]);


  

  const handleQuantityChange = (itemIndex, newQuantity, price) => {
    const updatedCart = [...cartList];
    updatedCart[itemIndex].quantity = newQuantity;
    setCartList(updatedCart);
  
    const updatedInitialItems = [...initialItems];
    updatedInitialItems[itemIndex].newquantity = newQuantity;
    
    updatedInitialItems[itemIndex].price = updatedCart[itemIndex].price * newQuantity;
    
    setInitialItems(updatedInitialItems);
  
    localStorage.setItem("localCartList", JSON.stringify(updatedInitialItems));
  };

  const handleDelete = async (item) => {
    const token = localStorage.getItem("authToken");
    const productId = item._id;
    try {
      // Update localCartList without resetting it
      const updatedLocalCartList = JSON.parse(localStorage.getItem("localCartList")).filter(cartItem => cartItem._id !== productId);
      localStorage.setItem("localCartList", JSON.stringify(updatedLocalCartList));
      setInitialItems(updatedLocalCartList);
      setCartList(updatedLocalCartList)
      setLocalCartLength(updatedLocalCartList.length)

  
      // Update server cart
      const fetchUrl = `${process.env.REACT_APP_API_URL}/api/cart/delete`;
      await axios.delete(fetchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { productId }
      });
  
    } catch (error) {
      console.error('Error deleting from cart:', error);
      setError('An error occurred while deleting from cart.');
  
      const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
      storedCartList.push(item);
      localStorage.setItem('localCartList', JSON.stringify(storedCartList));
      console.log('Added item back to local cart:', item);
      throw error; 
    }
  };

  useEffect(()=>{    
      if (cartList.length >= 0 && initialItems.length >= 0) {
    setTotal(initialItems.reduce((accumulator, obj) => accumulator + (obj.price), 0));
    localStorage.setItem("total" ,initialItems.reduce((accumulator, obj) => accumulator + (obj.price), 0))
  }}, [handleDelete])
  

  
  


 


  

  return (
    <div className="cart-container">
              {/* <img className="cart-bg-image" src={bgImage} alt="backgroundImage"/> */}

      <h3 className="cart-total"><span>Your Total: </span>${total}</h3>

      {isLoading ? (
        <div className="message">
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
          <p className="loading-message">Getting Your Cart Items...</p>
        </div>
      ) : error ? (
        <div className="message">
          <p className="error-message">Error: {error}</p>
        </div>
      ) : initialItems.length < 1 && token ? (
        <div className="empty-cart-container">
        <p className="empty-cart">Your cart is empty!!!</p>
        </div>
      ) : token ? (
        <div className="cart-list-container">
          {initialItems.map((item, index) => ( 
            <div className="cartlist" key={item._id}>
              <div className="about-cart-item">
              <Link className="cartlist-link" to={`/${item._id}`}>
                <img src={item.image} alt={item.name} />       
                </Link>
                <div className="cartlist-description">
                  <p><span className="description-header">Material:</span> {item.type}</p>
              
              <div className="cart-quantity">
              <p><span className="description-header">Quantity:</span></p>
              <select
                className="quantity-input"
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                value={initialItems[index]?.newquantity || 1}
              >
                {Array.from({ length: initialItems[index].quantity }, (_, i) => i + 1).map((optionValue) => (
                  <option key={optionValue} value={optionValue}>
                    {optionValue}
                  </option>
                ))} 
              </select>
              {initialItems[index]?.name == "fabric" ? (initialItems[index]?.newquantity == 1 ? (<small>yard</small>) : <small>yards</small>) : "" }
              </div> 
              <p><span className="description-header">Total price:</span> ${item.price}</p>
              </div>
              </div>
              
              <button className="remove-item-button" onClick={() => handleDelete(item)}>Remove</button>
            </div>
          ))}                 

          <Link className="checkout" to="/checkout"><button className="checkout-button">Go To Checkout</button></Link>
        </div>
      ) : (
        <div className="no-cart">
          <p>Please <Link to="/login">Login</Link> Or <Link to="/signup">Sign Up</Link> to view cart items.</p>
        </div>
      )}
    </div>
  );
}

export default Cart;



