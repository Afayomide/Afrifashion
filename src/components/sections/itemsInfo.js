import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./itemsInfo.css"
import { ProductContext } from "../productContext"

export default function ItemsInfo() {
    const [item, setItem] = useState([])
    const [error, setError] = useState("")
    const {cartList, setCartList, setInitialItems, initialItems, setLocalCartLength, setShouldFetchCart, setCartNo, authenticated} = useContext(ProductContext)
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



const handleQuantityChange = (id, newQuantity, price) => {

  function  updateClickedList() {
    console.log("Item found in clickedList");

    const updatedClickedList = [...clickedList];
    const clickedItemToUpdate = updatedClickedList.find((clickedItem) => clickedItem._id === id);
    clickedItemToUpdate.newquantity = newQuantity;
    clickedItemToUpdate.newprice = newQuantity * clickedItemToUpdate.price;

    localStorage.setItem("localClickedList", JSON.stringify(updatedClickedList));

    console.log("Updated clickedCartList:", updatedClickedList);
  }

  setSelectedQuantity(newQuantity); 

  localStorage.setItem(`selectedQuantity-${id}`, JSON.stringify(newQuantity));


  if (Array.isArray(cartList) && cartList.find((item) => item._id == id)) {
    const matchingCartItem = cartList.find((cartItem) => cartItem._id === id);

    if (!matchingCartItem) {
      console.error("Item with id", id, "not found in cartList");
      console.log("cartlist:", cartList)
      return updateClickedList()
    }

    const updatedCartList = [...cartList];
    matchingCartItem.quantity = newQuantity;
    matchingCartItem.price = price * newQuantity; 

    const matchingInitialItem = Array.isArray(initialItems) && initialItems.find((initialItem) => initialItem._id === id);

    if (!matchingInitialItem) {
      console.error("Item with id", id, "not found in initialItems");
      console.log("initialItem:", initialItems)
      return updateClickedList()
    }

    const updatedInitialItems = [...initialItems];
    updatedInitialItems.find((initialItem) => initialItem._id === id).newquantity = newQuantity;
    updatedInitialItems.find((initialItem) => initialItem._id === id).price = newQuantity * item.price;

    setCartList(updatedCartList);
    setInitialItems(updatedInitialItems);  

    localStorage.setItem("localCartList", JSON.stringify(updatedInitialItems));
    console.log(updatedCartList);
    console.log(updatedInitialItems);
  } 
  if (Array.isArray(clickedList) && clickedList.find((item) => item._id === id)) {
   updateClickedList()
  }
};


 const handleDelete = async (item) => {
  const productId = item._id;

  try {
    const updatedLocalCartList = JSON.parse(localStorage.getItem("localCartList")).filter(cartItem => cartItem._id !== productId);
    localStorage.setItem("localCartList", JSON.stringify(updatedLocalCartList));
    setInitialItems(updatedLocalCartList);
    setCartList(updatedLocalCartList)
    setLocalCartLength(updatedLocalCartList.length)

    if (authenticated) {
      const fetchUrl = `${process.env.REACT_APP_API_URL}/api/cart/delete`;
      await axios.delete(fetchUrl, {
        data: { productId }
      });
    }

  } catch (error) {
    console.error('Error deleting from cart:', error);
    setError('An error occurred while deleting from cart.');

    const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
    storedCartList.push(item);
    localStorage.setItem('localCartList', JSON.stringify(storedCartList));
    console.log('Added item back to local cart:', item);
    setLocalCartLength(storedCartList.length)
    throw error; 
  }
};


  const handleAddToCart = async (fabric) => {
    const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
    const clickedCartList = JSON.parse(localStorage.getItem('localClickedList')) || [];
    
    const clickedItem = clickedCartList.find(item => item._id === fabric._id);
    const fabricWithQuantity = { ...fabric, 
      newquantity: clickedItem ? clickedItem.newquantity : 1,
      price: clickedItem ? clickedItem.newprice : fabric.price,
    };
  
    // Check if the item already exists in the local cart
    const existingItemIndex = storedCartList.findIndex(item => item._id === fabric._id);
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      storedCartList[existingItemIndex].newquantity = fabricWithQuantity.newquantity;
    } else {
      // Add new item if it doesn't exist
      storedCartList.push(fabricWithQuantity);
    }
  
    localStorage.setItem('localCartList', JSON.stringify(storedCartList));
    console.log('Updated local cart:', storedCartList);
  
    setLocalCartLength(storedCartList.length);
    setCartNo(storedCartList.length);
  
    if (authenticated) {
      try {
        const productId = fabric._id;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/add`,
          { productId },
        );
  
        console.log('Added fabric to server cart:', response.data);
      } catch (error) {
        console.error('Error adding to cart:', error);
        setError('An error occurred while adding to cart.');
  
        // If there's an error, remove the item from local storage
        const updatedCartList = storedCartList.filter(item => item._id !== fabric._id);
        localStorage.setItem('localCartList', JSON.stringify(updatedCartList));
        console.log('Removed fabric from local cart:', fabric);
        setLocalCartLength(updatedCartList.length);
      } finally {
        setShouldFetchCart(true);
      }
    }
  };
  


  

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
      {cartList.some((cartItem) => cartItem._id === item._id) || 
      (JSON.parse(localStorage.getItem('localCartList')) || []).some(
        (storedCartItem) => storedCartItem._id === item._id) ? (
<button onClick={() => handleDelete(item)} className="already-in-cart">Remove From Cart</button>) :
 (<button onClick={()=> (handleAddToCart(item))} className="add-to-cart">Add To Cart</button>)}
      </div>
  <div className="item-details">
            <p className="description">{item.type}</p>      
            <p className="type">{item.type}</p>
            <p className="material">{item?.material}</p>
            <p className="price">${item.price}</p>
      <div>
        Quantity in yards: <select
  className="quantity-input"
  onChange={(e) => handleQuantityChange(id, parseInt(e.target.value))}
  value={
    (Array.isArray(initialItems) && initialItems.find((item) => item._id == id)?.newquantity) ||
    (Array.isArray(clickedList) && clickedList.find((item) => item._id == id)?.newquantity)
  }
>
  {Array.from({
    length: item.quantity
  }, (_, i) => i + 1).map((optionValue) => (
    <option key={optionValue} value={optionValue}>
      {optionValue}
    </option>
  ))}
</select>            

      </div>
      <p>Your Total Price: ${clickedList.find((clickedItem) => clickedItem._id === id)?.newprice || initialItems.find((item) => item._id == id)?.price || item.price }</p>
      <p>Description: {item.description}</p>
</div>


        </div>
    )
}