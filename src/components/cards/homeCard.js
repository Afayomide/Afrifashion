"use client";

import { memo } from "react";
import Preloader from "../../preloader";
import { ProductContext } from "../productContext";
import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Check,
  AlertCircle,
  DollarSign,
  Package,
} from "lucide-react";
const token = localStorage.getItem("token");

const Card = memo(function Card(props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { authenticated, setCartNo, setShouldFetchCart, setLocalCartLength } =
    useContext(ProductContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [slideInItems, setSlideInItems] = useState(new Set()); // Track items that have slid in
  const itemRefs = useRef([]); // Store refs for each item

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSlideInItems((prev) => new Set([...prev, entry.target])); // Add item to set
          observer.unobserve(entry.target); // Stop observing once item is visible
        }
      });
    });

    // Observe each item
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, []);

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
          { productId },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Correct way to send token
            },
          }
        );
      } catch (error) {
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

  function localClickedList(fabric) {
    const clickedList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];
    const clickedItemId = clickedList.find((item) => item._id === fabric._id); // Assuming 'id' is unique for each fabric
    if (clickedItemId) {
    } else {
      const clickedItem = { ...fabric, newquantity: 1 };
      clickedList.push(clickedItem);
    }
    localStorage.setItem("localClickedList", JSON.stringify(clickedList));
  }

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const isInCart = (
    JSON.parse(localStorage.getItem("localCartList")) || []
  ).some((storedCartItem) => storedCartItem._id === props._id);

  return (
    <div
      ref={(el) => (itemRefs.current[props.index] = el)}
      className={`home-product-list ${
        props.status === "out of stock" ? "out-of-stock" : ""
      } ${slideInItems.has(itemRefs.current[props.index]) ? "slide-in" : ""}`}
      key={props._id}
    >
      <Link
        onClick={() =>
          props.status === "in stock" ||
          (props.status === "low stock" && localClickedList(props))
        }
        className={`home-product-link ${
          props.status === "out of stock" ? "disabled-link" : ""
        }`}
        to={
          props.status === "in stock" || props.status === "low stock"
            ? `/${props._id}`
            : "#"
        }
      >
        <div className="fab-image-container">
          {!isImageLoaded && <Preloader />}
          <img
            src={props.images[0] || "/placeholder.svg"}
            alt={props.name}
            className={`${
              props.status === "out of stock" ? "out-of-stock-img" : ""
            } ${!isImageLoaded ? "hidden" : ""}`}
            onLoad={handleImageLoad}
          />
        </div>

        <div className="home-product-link-texts">
          <p className="product-type">{props.type}</p>
          <p className="product-price">
            <DollarSign size={14} className="info-icon" />
            <span>{props.price}</span> per yard
          </p>
          <p className="product-quantity">
            <Package size={14} className="info-icon" />
            <span>{props.quantity}</span> yards left
          </p>
        </div>
      </Link>

      {isInCart ? (
        <Link to={`/${props._id}`} className="cart-button-link">
          <button
            onClick={() => navigate(`/${props._id}`)}
            className="cart-button already-in-cart"
          >
            <Check size={16} className="button-icon" />
            <span>Added To Cart</span>
          </button>
        </Link>
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

export default Card;
