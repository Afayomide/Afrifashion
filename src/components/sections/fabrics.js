import { useEffect, useState, memo } from "react";
import axios from "axios";
import { useContext } from "react";
import { ProductContext } from "../productContext";
import { Link } from "react-router-dom";
import "./sections.css";
import formbg from "../../assets/formbg.webp";

const Fabrics = memo(() => {
  const [fabricsList, setFabricsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [buttonType, setButtonType] = useState("add To Cart");

  const handleAddToCart = async (fabric) => {
    const storedCartList =
      JSON.parse(localStorage.getItem("localCartList")) || [];
    const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
    storedCartList.push(fabricWithQuantity);
    localStorage.setItem("localCartList", JSON.stringify(storedCartList));
    console.log("Added fabric to local cart:", fabric);

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

        console.log("Added fabric to server cart:", response.data);
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/fabrics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFabricsList(response.data.fabrics);

        if (response.data.fabrics && token) {
          try {
            const cartResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/cart/list`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setCartList(cartResponse.data.cartItems);
          } catch (error) {
            console.error("Error fetching cart data:", error);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setMainLoading(false);
          console.log("empty");
        }
        console.error("Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    if (mainLoading == true) {
      fetchData();
    } else {
      setIsLoading(false);
      console.log("something is wrong");
      setError("something is wrong");
    }
  }, []);

  return (
    <div className="product-list-container">
      {isLoading ? (
        <div className="message">
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
          <p className="loading-message">....Getting all fabrics</p>
        </div>
      ) : error ? (
        <div className="message">
          <img className="error-image" src={formbg} alt="error background" />
          <p className="error-message">Error: {error}</p>
        </div>
      ) : fabricsList.length > 0 ? (
        <div className="product-list-container">
          {fabricsList.map((fabric, index) => (
            <div
              className={`product-list ${
                fabric.outOfStock ? "out-of-stock" : ""
              }`}
              key={fabric._id}
            >
              <Link
                onClick={() => !fabric.outOfStock && localClickedList(fabric)}
                className={`product-link ${
                  fabric.outOfStock ? "disabled-link" : ""
                }`}
                to={!fabric.outOfStock ? `/${fabric._id}` : "#"}
              >
                <img
                  src={fabric.image}
                  alt={fabric.name}
                  className={fabric.outOfStock ? "out-of-stock-img" : ""}
                />
                <div className="product-link-texts">
                  <p>{fabric.type}</p>
                  <p>
                    <span>${fabric.price}</span> per yard
                  </p>
                  <p>
                    <span>{fabric.quantity} yards</span> left
                  </p>
                </div>
              </Link>

              {cartList.some((cartItem) => cartItem._id === fabric._id) ||
              (JSON.parse(localStorage.getItem("localCartList")) || []).some(
                (storedCartItem) => storedCartItem._id === fabric._id
              ) ? (
                <button className="cart-button already-in-cart">
                  <Link className="already-link" to={`/${fabric._id}`}>
                    {" "}
                    Added To Cart
                  </Link>
                </button>
              ) : !fabric.outOfStock ? (
                <button
                  className="cart-button add-to-cart"
                  onClick={() => handleAddToCart(fabric)}
                >
                  Add to Cart
                </button>
              ) : (
                <button className="cart-button out-of-stock-button">
                  Out Of Stock
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="message">
          <p className="loading-message">No fabric found</p>
        </div>
      )}
    </div>
  );
});

export default Fabrics;
