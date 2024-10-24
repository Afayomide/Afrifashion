import Preloader from "../../preloader";
import { Link } from "react-router-dom";
import { useEffect, useState, memo } from "react";
import { useContext } from "react";
import axios from "axios";
import "./cards.css"

import { ProductContext } from "../productContext";

export function Card(props) {
  const [error, setError] = useState(null);
  const {
    authenticated,
    setCartNo,
    setShouldFetchCart,
    setLocalCartLength,
    cartList,
  } = useContext(ProductContext);

  function localClickedList(fabric) {
    const clickedList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];
    const clickedItemId = clickedList.find((item) => item._id === fabric._id); // Assuming 'id' is unique for each fabric
    if (clickedItemId) {
      console.log("already in");
    } else {
      const clickedItem = { ...fabric, newquantity: 1 };
      clickedList.push(clickedItem);
      console.log(clickedItem);
      console.log("not in");
    }
    localStorage.setItem("localClickedList", JSON.stringify(clickedList));
    console.log(clickedList);
  }

  const handleAddToCart = async (fabric) => {
    const storedCartList =
      JSON.parse(localStorage.getItem("localCartList")) || [];
    const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
    storedCartList.push(fabricWithQuantity);
    localStorage.setItem("localCartList", JSON.stringify(storedCartList));


    setLocalCartLength(storedCartList.length);
    setCartNo(storedCartList.length);

    if (authenticated) {
      try {
        if (!authenticated) {
          throw new Error("User not authenticated");
        }

        const productId = fabric._id;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/add`,
          { productId }
        );

      } catch (error) {
        console.error("Error adding to cart:", error);
        setError("An error occurred while adding to cart.");

        const updatedCartList = storedCartList.filter(
          (item) => item._id !== fabric._id
        );
        localStorage.setItem("localCartList", JSON.stringify(updatedCartList));
        console.log("Removed fabric from local cart:", fabric);
      } finally {
        setShouldFetchCart(true);
      }
    }
  };

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  return (
    <div
      className={`product-list ${props.outOfStock ? "out-of-stock" : ""}`}
      key={props._id}
    >
      <Link
        onClick={() => !props.outOfStock && localClickedList(props)}
        className={`product-link ${props.outOfStock ? "disabled-link" : ""}`}
        to={!props.outOfStock ? `/${props._id}` : "#"}
      >
        {!isImageLoaded && <Preloader />}
        <div className={`image-wrapper ${props.outOfStock ? "out-of-stock" : ""}`}>
          <img
            src={props.image}
            alt={props.name}
            className={props.outOfStock ? "out-of-stock-img" : ""}
            onLoad={handleImageLoad}
          />
          {props.outOfStock && (
            <div className="out-of-stock-overlay">Out Of Stock</div>
          )}
        </div>
        <div className="product-link-texts">
          <p>{props.type}</p>
          <p>
            <span>${props.price}</span> per yard
          </p>
          <p>
            <span>{props.quantity} yards</span> left
          </p>
        </div>
      </Link>
  
      {cartList.some((cartItem) => cartItem._id === props._id) ||
      (JSON.parse(localStorage.getItem("localCartList")) || []).some(
        (storedCartItem) => storedCartItem._id === props._id
      ) ? (
        <button className="cart-button already-in-cart">
          <Link className="already-link" to={`/${props._id}`}>
            {" "}
            Added To Cart
          </Link>
        </button>
      ) : !props.outOfStock ? (
        <button
          className="cart-button add-to-cart"
          onClick={() => handleAddToCart(props)}
        >
          Add to Cart
        </button>
      ) : (
        <button className="cart-button out-of-stock-button">
          Out Of Stock
        </button>
      )}
    </div>
  );
  
}
