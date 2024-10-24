import Preloader from "../../preloader";
import { ProductContext } from "../productContext";
import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


function Card(props) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const {
        authenticated,
        cartNo,
        setCartNo,
        setShouldFetchCart,
        mainLoading,
        setMainLoading,
        setLocalCartLength,
        cartList,
        setCartList,
      } = useContext(ProductContext);
      const [error, setError] = useState(null);
      const navigate = useNavigate();
      const [slideInItems, setSlideInItems] = useState(new Set()); // Track items that have slid in
      const itemRefs = useRef([]); // Store refs for each item

      useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setSlideInItems((prev) => new Set(prev).add(entry.target)); // Add item to set
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
              { productId }
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



    return (
      <div
        ref={(el) => (itemRefs.current[props.index] = el)}
        className={`home-product-list ${
          props.outOfStock ? "out-of-stock" : ""
        } ${slideInItems.has(props.index) ? "slide-in" : ""}`}
        key={props._id}
      >
        <Link
          onClick={() => !props.outOfStock && localClickedList(props)}
          className={`home-product-link ${
            props.outOfStock ? "disabled-link" : ""
          }`}
          to={!props.outOfStock ? `/${props._id}` : "#"}
        >
          {!isImageLoaded && <Preloader />}

          <img
            src={props.image}
            alt={props.name}
            className={`${props.outOfStock ? "out-of-stock-img" : ""} ${
              !isImageLoaded ? "hidden" : ""
            }`}
            onLoad={handleImageLoad}
          />
          <div className="home-product-link-texts">
            <p>{props.type}</p>
            <p>
              $<span>{props.price}</span> per yard
            </p>
            <p>
              <span>{props.quantity}</span> yards left
            </p>
          </div>
        </Link>

        {(JSON.parse(localStorage.getItem("localCartList")) || []).some(
          (storedCartItem) => storedCartItem._id === props._id
        ) ? (
          <Link to={`/${props._id}`}>
            <button
              onClick={() => navigate(`/${props._id}`)}
              className="home-cart-button already-in-cart"
            >
              Added To Cart
            </button>
          </Link>
        ) : !props.outOfStock ? (
          <button
            className="home-cart-button add-to-cart"
            onClick={() => handleAddToCart(props)}
          >
            Add to Cart
          </button>
        ) : (
          <button className="home-cart-button out-of-stock-button">
            Out Of Stock
          </button>
        )}
      </div>
    );
  }

export default Card