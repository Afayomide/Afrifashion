import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./itemsInfo.css"
import { ProductContext } from "../productContext"

export default function ItemsInfo() {
    const [item, setItem] = useState([])
    const [error, setError] = useState("")
    const {allClickedList,setAllClickedList, cartList, setCartList, setInitialItems, initialItems, setLocalCartLength, setShouldFetchCart, setCartNo} = useContext(ProductContext)
    const {id} = useParams()
    const [selectedQuantity, setSelectedQuantity] = useState(() => {
      const storedQuantity = JSON.parse(localStorage.getItem(`selectedQuantity-${id}`));
      return storedQuantity || 1 // Default to 1 if no stored quantity
  });

    useEffect(()=>{
  async function fetchData(){
       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/aboutItem`, {
        id
     })
        setItem(response.data.item)
  } 

  fetchData()
 }, [])


 const clickedList = JSON.parse(localStorage.getItem('localClickedList')) || []

//  const handleQuantityChange = (itemIndex, newQuantity, price) => {
//   const updatedCart = [...cartList];
//   updatedCart[itemIndex].quantity = newQuantity;
//   setCartList(updatedCart);

//   const updatedInitialItems = [...initialItems];
//   updatedInitialItems[itemIndex].newquantity = newQuantity;
  
//   updatedInitialItems[itemIndex].price = updatedCart[itemIndex].price * newQuantity;
  
//   setInitialItems(updatedInitialItems);

//   localStorage.setItem("localCartList", JSON.stringify(updatedInitialItems));
// };


const handleQuantityChange = (id, newQuantity, price) => {

  setSelectedQuantity(newQuantity); // Update the selected quantity in the state

  localStorage.setItem(`selectedQuantity-${id}`, JSON.stringify(newQuantity));


  if (Array.isArray(cartList) && cartList.find((item) => item._id == id)) {
    const matchingCartItem = cartList.find((cartItem) => cartItem._id === id);

    if (!matchingCartItem) {
      console.error("Item with id", id, "not found in cartList");
      return; 
    }

    const updatedCartList = [...cartList];
    matchingCartItem.quantity = newQuantity;
    matchingCartItem.price = price * newQuantity; 

    const matchingInitialItem = Array.isArray(initialItems) && initialItems.find((initialItem) => initialItem._id === id);

    if (!matchingInitialItem) {
      console.error("Item with id", id, "not found in initialItems");
      return; 
    }

    const updatedInitialItems = [...initialItems];
    updatedInitialItems.find((initialItem) => initialItem._id === id).newquantity = newQuantity;

    setCartList(updatedCartList);
    setInitialItems(updatedInitialItems);  // Use updatedInitialItems here

    localStorage.setItem("localCartList", JSON.stringify(updatedInitialItems));
    console.log(updatedCartList);
    console.log(updatedInitialItems);
  } else if (Array.isArray(clickedList) && clickedList.find((item) => item._id === id)) {
    console.log("Item found in clickedList");
  }
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

    if (token) {
      // Update server cart only if token exists
      const fetchUrl = `${process.env.REACT_APP_API_URL}/api/cart/delete`;
      await axios.delete(fetchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { productId }
      });
    }

  } catch (error) {
    console.error('Error deleting from cart:', error);
    setError('An error occurred while deleting from cart.');

    // If server update is not successful or no token, add the item back to the local cart list
    const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
    storedCartList.push(item);
    localStorage.setItem('localCartList', JSON.stringify(storedCartList));
    console.log('Added item back to local cart:', item);
    setLocalCartLength(storedCartList.length)
    throw error; // Rethrow the error to indicate failure
  }
};


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
      setLocalCartLength(updatedCartList.length);
    } finally {
      setShouldFetchCart(true); 
    }
  }
  };

  // var itemLength =initialItems.find((initialItem) => initialItem._id === id)?.quantity || 1

  

    return(
        <div className="item-info">
        <div className="item-info-img-container">
           {item.image ? (
        <img className="item-info-img" src={item.image} alt={item.name} />
      ) : (
        <div className="loader">
          <div className="item-image-loader-container">
        <div className="item-image-spinner"></div>
    </div>
    </div>
      )}
      </div>
      <p>Type: {item.name}</p>
            <p>Material: {item.type}</p>
            <p>Your Total Price: {item.price * selectedQuantity}</p>
      <div>
        Quantity of yards left in stock : <select
  className="quantity-input"
  onChange={(e) => handleQuantityChange(id, parseInt(e.target.value))}
  value={
    (Array.isArray(initialItems) && initialItems.find((item) => item._id == id)?.newquantity) ||
    (Array.isArray(clickedList) && clickedList.find((clickedItem) => clickedItem._id == id)?.newquantity) ||
    1
  }
>
  {Array.from({
    length:
      (Array.isArray(initialItems) && initialItems.find((initialItem) => initialItem._id === id)?.quantity) ||
      (Array.isArray(clickedList) && clickedList.find((clickedItem) => clickedItem._id === id)?.quantity) ||
      1,
  }, (_, i) => i + 1).map((optionValue) => (
    <option key={optionValue} value={optionValue}>
      {optionValue}
    </option>
  ))}
</select>
      </div>
{cartList.some((cartItem) => cartItem._id === item._id) || (JSON.parse(localStorage.getItem('localCartList')) || []).some((storedCartItem) => storedCartItem._id === item._id) ? (
<button onClick={() => handleDelete(item)} className="already-in-cart">Remove From Cart</button>) : (<button onClick={()=> (handleAddToCart(item))} className="add-to-cart">Add To Cart</button>)}



  <p>{item.price}</p>

<p>{item.name}</p>
        </div>
    )
}