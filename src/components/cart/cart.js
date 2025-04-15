"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ProductContext } from "../productContext";
import { Link } from "react-router-dom";
import { useCurrency } from "../currency/currencyContext";
import "./cart.css";
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  AlertCircle,
  ShoppingBag,
  Loader,
} from "lucide-react";
import { applyExchangeRate } from "../currency/exchangeRate";

function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    cartList,
    setCartList,
    authenticated,
    initialItems,
    setInitialItems,
    shouldFetchCart,
    setShouldFetchCart,
    mainLoading,
    setMainLoading,
    setLocalCartLength,
    total,
    setTotal,
  } = useContext(ProductContext);
  const [error, setError] = useState(null);
  const { currency, exchangeRate } = useCurrency();

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (authenticated && mainLoading && exchangeRate) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/cart/list`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`, // Correct way to send token
              },
            }
          );
          const cartListWithRate = applyExchangeRate(
            response.data.cartItems,
            exchangeRate
          );

          setCartList(cartListWithRate);

          const storedCartList = JSON.parse(
            localStorage.getItem("localCartList")
          );

           const localClickedList = JSON.parse(
             localStorage.getItem("localClickedList") || "[]"
           );

           console.log(cartListWithRate);
           if (
             storedCartList &&
             arraysHaveSameItemsById(storedCartList, cartListWithRate)
           ) {
             console.log("same", storedCartList);
             setInitialItems(storedCartList);
           } else {
             const initialItemsWithQuantity = cartListWithRate.map((item) => {
               var existingClickedItem = localClickedList.find(
                 (clickedItem) => clickedItem._id === item._id
               );

               var quantity = existingClickedItem?.newquantity ?? 1;

               // Priority: localClickedList.discountPrice > localClickedList.price > original
               var updatedPrice = item.price;
               var updatedDiscountPrice = item.discountPrice;

               if (existingClickedItem) {
                 if (existingClickedItem.discountPrice) {
                   console.log("discount", existingClickedItem.newprice);
                   updatedDiscountPrice = existingClickedItem.newprice;
                 } else if (existingClickedItem.price) {
                   console.log("discount", existingClickedItem.newprice);

                   updatedPrice = existingClickedItem.newprice;
                   updatedDiscountPrice = null; // remove discount if only price is updated
                 }
               }

               return {
                 ...item,
                 newquantity: quantity,
                 price: updatedPrice,
                 discountPrice: updatedDiscountPrice,
               };
             });

             setInitialItems(initialItemsWithQuantity);
             localStorage.setItem(
               "localCartList",
               JSON.stringify(initialItemsWithQuantity)
             );
           }
        } catch (error) {
          if (error.response && error.response.status === 500) {
            setMainLoading(false);
          }
          setError(error.message || "An error occurred.");
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
    setShouldFetchCart(false);
  }, [
    shouldFetchCart,
    mainLoading,
    setMainLoading,
    setShouldFetchCart,
    authenticated,
    exchangeRate,
  ]);


  const handleQuantityChange = (id, itemIndex, newQuantity, price) => {
    const updatedCart = [...cartList];
    updatedCart[itemIndex].quantity = newQuantity;
    setCartList(updatedCart);

    console.log(cartList)
    const updatedInitialItems = [...initialItems];
    updatedInitialItems[itemIndex].newquantity = newQuantity;
    updatedInitialItems[itemIndex].price =
      updatedCart[itemIndex].price * newQuantity;
    updatedInitialItems[itemIndex].discountPrice =
      updatedCart[itemIndex].discountPrice * newQuantity;
    setInitialItems(updatedInitialItems);

    localStorage.setItem("localCartList", JSON.stringify(updatedInitialItems));
    const clickedList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];

    if (
      Array.isArray(clickedList) &&
      clickedList.find((item) => item._id === id)
    ) {
      const updatedClickedList = [...clickedList];
      const clickedItemToUpdate = updatedClickedList.find(
        (clickedItem) => clickedItem._id === id
      );
      clickedItemToUpdate.newquantity = newQuantity;
      clickedItemToUpdate.newprice =
        newQuantity * clickedItemToUpdate.discountPrice ||
        newQuantity * clickedItemToUpdate.price;

      localStorage.setItem(
        "localClickedList",
        JSON.stringify(updatedClickedList)
      );
    }
  };

  const handleDelete = async (item) => {
    const productId = item._id;
    try {
      // Update localCartList without resetting it
      const updatedLocalCartList = JSON.parse(
        localStorage.getItem("localCartList")
      ).filter((cartItem) => cartItem._id !== productId);
      localStorage.setItem(
        "localCartList",
        JSON.stringify(updatedLocalCartList)
      );
      setInitialItems(updatedLocalCartList);
      setCartList(updatedLocalCartList);
      setLocalCartLength(updatedLocalCartList.length);

      // Update server cart
      const fetchUrl = `${process.env.REACT_APP_API_URL}/api/cart/delete`;
      await axios.delete(fetchUrl, {
        data: { productId },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // Correct way to send token
        },
      });
    } catch (error) {
      console.error("Error deleting from cart:", error);
      setError("An error occurred while deleting from cart.");

      const storedCartList =
        JSON.parse(localStorage.getItem("localCartList")) || [];
      storedCartList.push(item);
      localStorage.setItem("localCartList", JSON.stringify(storedCartList));
      throw error;
    }
  };

  useEffect(() => {
    if (cartList.length >= 0 && initialItems.length >= 0) {
      setTotal(
        initialItems.reduce((accumulator, obj) => {
          var priceToUse = obj.discountPrice ?? obj.price;
          return accumulator + priceToUse;
        }, 0)
      );
      localStorage.setItem(
        "total",
        initialItems.reduce((accumulator, obj) => {
          var priceToUse = obj.discountPrice ?? obj.price;
          return accumulator + priceToUse;
        }, 0)
      );
    }
  }, [handleDelete]);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <ShoppingCart size={28} className="cart-icon" />
        <h2>Your Shopping Cart</h2>
      </div>

      <div className="cart-total-container">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">
            {currency}
            {total}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="cart-message loading">
          <Loader size={40} className="loader-icon" />
          <p>Getting Your Cart Items...</p>
        </div>
      ) : error ? (
        <div className="cart-message error">
          <AlertCircle size={40} />
          <p>Error: {error}</p>
        </div>
      ) : initialItems.length < 1 && authenticated ? (
        <div className="empty-cart-container">
          <ShoppingBag size={60} />
          <p className="empty-cart">Your cart is empty!</p>
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : authenticated ? (
        <div className="cart-content">
          <div className="cart-list-container">
            {initialItems.map((item, index) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-image">
                  <Link to={`/${item._id}`}>
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                    />
                  </Link>
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <p className="item-type">
                      <span className="label">Material:</span>
                      <span className="value">{item.type}</span>
                    </p>

                    <div className="cart-quantity">
                      <p className="label">Quantity:</p>
                      <div className="quantity-selector">
                        <select
                          className="quantity-input"
                          onChange={(e) =>
                            handleQuantityChange(
                              item._id,
                              index,
                              Number.parseInt(e.target.value)
                            )
                          }
                          value={initialItems[index]?.newquantity || 1}
                        >
                          {Array.from(
                            { length: initialItems[index].quantity },
                            (_, i) => i + 1
                          ).map((optionValue) => (
                            <option key={optionValue} value={optionValue}>
                              {optionValue}
                            </option>
                          ))}
                        </select>
                        {initialItems[index]?.name === "fabric" ? (
                          <span className="unit">
                            {initialItems[index]?.newquantity === 1
                              ? "yard"
                              : "yards"}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <p className="item-price">
                      <span className="label">Price:</span>
                      <span className="value">
                        {currency}
                        {item.discountPrice || item.price}
                      </span>
                    </p>
                  </div>

                  <button
                    className="remove-item-button"
                    onClick={() => handleDelete(item)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>
                {currency}
                {total}
              </span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>
                {currency}
                {total}
              </span>
            </div>

            <Link className="checkout-link" to="/checkout">
              <button className="checkout-button">
                <CreditCard size={18} />
                <span>Proceed to Checkout</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="auth-required">
          <AlertCircle size={40} />
          <p>
            Please <Link to="/login">Login</Link> or{" "}
            <Link to="/signup">Sign Up</Link> to view your cart items.
          </p>
        </div>
      )}
    </div>
  );
}

export default Cart;
