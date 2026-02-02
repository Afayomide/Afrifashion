"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ProductContext } from "../productContext";
import Link from "next/link";
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
  const {
    cartItems,
    authenticated,
    cartTotal,
    updateQuantity,
    removeFromCart,
    fetchCart
  } = useContext(ProductContext)!;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currency, exchangeRate } = useCurrency();

  useEffect(() => {
    if (authenticated && exchangeRate) {
      setIsLoading(true);
      fetchCart().finally(() => setIsLoading(false));
    }
  }, [authenticated, exchangeRate, fetchCart]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleDelete = async (item: any) => {
    try {
      await removeFromCart(item._id);
    } catch (err) {
      setError("Failed to remove item");
    }
  };

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
            {cartTotal.toLocaleString()}
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
      ) : cartItems.length < 1 ? (
        <div className="empty-cart-container">
          <ShoppingBag size={60} />
          <p className="empty-cart">Your cart is empty!</p>
          <Link href="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-list-container">
            {cartItems.map((item: any) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-image">
                  <Link href={`/${item._id}`}>
                    <img
                      src={item.images?.[0] || "/placeholder.svg"}
                      alt={item.name || item.type}
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
                              Number.parseInt(e.target.value)
                            )
                          }
                          value={item.cartQuantity || 1}
                        >
                          {Array.from(
                            { length: Math.max(item.quantity || 1, item.cartQuantity || 1) },
                            (_, i) => i + 1
                          ).map((optionValue) => (
                            <option key={optionValue} value={optionValue}>
                              {optionValue}
                            </option>
                          ))}
                        </select>
                        <span className="unit">
                          {item.cartQuantity === 1 ? " yard" : " yards"}
                        </span>
                      </div>
                    </div>

                    <p className="item-price">
                      <span className="label">Price:</span>
                      <span className="value">
                        {currency}
                        {((item.discountPrice || item.price) * item.cartQuantity).toLocaleString()}
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
                {cartTotal.toLocaleString()}
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
                {cartTotal.toLocaleString()}
              </span>
            </div>

            <Link className="checkout-link" href="/checkout">
              <button className="checkout-button">
                <CreditCard size={18} />
                <span>Proceed to Checkout</span>
              </button>
            </Link>
          </div>
        </div>
      )}
      {!authenticated && cartItems.length > 0 && (
        <div className="auth-required">
          <AlertCircle size={40} />
          <p>
            Please <Link href="/login">Login</Link> or{" "}
            <Link href="/signup">Sign Up</Link> to sync your cart across devices.
          </p>
        </div>
      )}
    </div>
  );
}

export default Cart;
