"use client";

import Preloader from "../../preloader";
import { Link } from "react-router-dom";
import { useState, memo } from "react";
import { useContext } from "react";
import axios from "axios";
import "./cards.css";
import {
  ShoppingCart,
  Check,
  AlertCircle,
  DollarSign,
  Package,
} from "lucide-react";

import { ProductContext } from "../productContext";

export const Card = memo(function Card(props) {
  const [error, setError] = useState(null);
  const {
    authenticated,
    setCartNo,
    setShouldFetchCart,
    setLocalCartLength,
    cartList,
  } = useContext(ProductContext);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  function localClickedList(fabric) {
    const clickedList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];
    const clickedItemId = clickedList.find((item) => item._id === fabric._id);
    if (!clickedItemId) {
      const clickedItem = { ...fabric, newquantity: 1 };
      clickedList.push(clickedItem);
    }
    localStorage.setItem("localClickedList", JSON.stringify(clickedList));
  }

  const handleAddToCart = async (fabric) => {
    const storedCartList =
      JSON.parse(localStorage.getItem("localCartList")) || [];
    const fabricWithQuantity = { ...fabric, newquantity: 1 };
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
        await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/add`, {
          productId,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        setError("An error occurred while adding to cart.");

        const updatedCartList = storedCartList.filter(
          (item) => item._id !== fabric._id
        );
        localStorage.setItem("localCartList", JSON.stringify(updatedCartList));
      } finally {
        setShouldFetchCart(true);
      }
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const isInCart =
    cartList.some((cartItem) => cartItem._id === props._id) ||
    (JSON.parse(localStorage.getItem("localCartList")) || []).some(
      (storedCartItem) => storedCartItem._id === props._id
    );

  return (
    <div
      className={`product-list ${
        props.status === "out of stock" ? "out-of-stock" : ""
      }`}
      key={props._id}
    >
      <Link
        onClick={() =>
          (props.status === "in stock" || props.status === "low stock") &&
          localClickedList(props)
        }
        className={`product-link ${
          props.status === "out of stock" ? "disabled-link" : ""
        }`}
        to={
          props.status === "in stock" || props.status === "low stock"
            ? `/${props._id}`
            : "#"
        }
      >
        <div
          className={`image-wrapper ${
            props.status === "out of stock" ? "out-of-stock" : ""
          }`}
        >
          <div className="fab-image-container">
            {!isImageLoaded && <Preloader />}
            <img
              src={props.images[0] || "/placeholder.svg"}
              alt={props.type}
              className={
                props.status === "out of stock" ? "out-of-stock-img" : ""
              }
              onLoad={handleImageLoad}
            />
          </div>
          {props.status === "out of stock" && (
            <div className="out-of-stock-overlay">Out Of Stock</div>
          )}
        </div>
        <div className="product-link-texts">
          <p className="product-type">{props.type}</p>
          <p className="product-price">
            <DollarSign size={14} className="info-icon" />
            <span>{props.price}</span> per yard
          </p>
          <p className="product-quantity">
            <Package size={14} className="info-icon" />
            <span>{props.quantity} yards</span> left
          </p>
        </div>
      </Link>

      {isInCart ? (
        <button className="cart-button already-in-cart">
          <Link className="already-link" to={`/${props._id}`}>
            <Check size={16} className="button-icon" />
            <span>Added To Cart</span>
          </Link>
        </button>
      ) : props.status === "in stock" || props.status === "low stock" ? (
        <button
          className="cart-button add-to-cart"
          onClick={() => handleAddToCart(props)}
        >
          <ShoppingCart size={16} className="button-icon" />
          <span>Add to Cart</span>
        </button>
      ) : (
        <button className="cart-button out-of-stock-button">
          <AlertCircle size={16} className="button-icon" />
          <span>Out Of Stock</span>
        </button>
      )}
    </div>
  );
});
