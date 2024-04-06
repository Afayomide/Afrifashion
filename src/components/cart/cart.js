
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from 'react';
import { ProductContext } from '../productContext';
import { Link } from "react-router-dom";
import "./cart.css";
import { usePaystackPayment } from "react-paystack";


console.log(JSON.parse(localStorage.getItem('localCartList')))

function Cart () {
  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {initialItems, setInitialItems, shouldFetchCart, setShouldFetchCart, mainLoading, setMainLoading, setLocalCartLength } = useContext(ProductContext);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

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

          

          if (storedCartList && storedCartList.length === response.data.cartItems.length) {

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
    
    // Update price based on new quantity
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
  
      // If server update is not successful, add the item back to the local cart list
      const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
      storedCartList.push(item);
      localStorage.setItem('localCartList', JSON.stringify(storedCartList));
      console.log('Added item back to local cart:', item);
      throw error; // Rethrow the error to indicate failure
    }
  };
  
  let total = 0;
  if (cartList.length > 0 && initialItems.length > 0) {
    total = initialItems.reduce((accumulator, obj) => accumulator + (obj.price), 0);
  }
  const [email, setEmail] = useState("")
  const amount = total + .00
  const publicKey = "pk_test_92549e9f5f279539fd738adbad7ca5c4efa207ea";
  const [disable, setDisable] = useState()


  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount,
    publicKey,
};
const onSuccess = () => {
  console.log("Success")
  // emailjs.sendForm('service_yyeo66h', 'template_e3plaus', form.current, '-uGNesM2dn2b2lqIY')
  // localStorage.removeItem("item");
  // ToggleData()
  // setItems([])
};
const onClose = () => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log('closed')
}

  const PaystackHookButton = () => {
    const initializePayment = usePaystackPayment(config);
// function flashWarning(e) {
//   if(phone == ""){
//     setPhoneWarning("warning")
//   }
//   if(phone !==""){
//     setPhoneWarning("")
//   }
//   if(email == ""){
//     setEmailWarning("warning")
//   }
//   if(email !==""){
//     setEmailWarning("")
//   }
//   if(radioval == ""){
//     setRadioWarning("warning")
//   }
//   if(radioval !== "") {
//     setRadioWarning("")
//   }
//   if(addVisibility == true && address == "") {
//     setAddressWarning("warning")
//   }
//   if(address !==  ""){
//     setAddressWarning("")
//   }
//   if(phone !== ""  && email !=="" && radioval !==""){
//     if(addVisibility == true && address!== "" || addVisibility == false){
//       initializePayment(onSuccess, onClose)
//     }
//     // if (addVisibility== false){
//     //   initializePayment(onSuccess, onClose)
//     // }
//   }
// }

    return (
      <div>
          <button className="checkout-button"  type="button" onClick={() => {
            // flashWarning()
            initializePayment(onSuccess, onClose)
            console.log(publicKey)
          }}>Checkout</button>
      </div>
    );
};

  return (
    <div className="cart-container">
      <h3 className="cart-total"><span>Your Total: </span>₦{total}</h3>

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
                <div>
                  <p><span className="description-header">Type:</span> {item.type}</p>
                  <p><span className="description-header">Total price:</span> ${item.price}</p>
              
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
              {initialItems[index]?.type == "fabric" ? (initialItems[index]?.newquantity == 1 ? (<small>yard</small>) : <small>yards</small>) : "" }
              </div>
              </div>
              </div>
              
              <button className="remove-item-button" onClick={() => handleDelete(item)}>Remove</button>
            </div>
          ))}
          <div><PaystackHookButton type="submit"/></div>
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



