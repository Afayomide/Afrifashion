"use client";

import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../productContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./checkout.css";
import Select from "react-select";
import { useCurrency } from "../currency/currencyContext";
import { Country, State } from "country-state-city";
import {
  Truck,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

function CheckoutPage() {
  const { total, setTotal, authenticated, initialItems } =
    useContext(ProductContext);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [focused, setFocused] = useState(null);
  const {countryCode} = useCurrency(); 
  const apiUrl = process.env.REACT_APP_API_URL;

  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    setTotal(localStorage.getItem("total"));
  }, []);

  const localEmail = localStorage.getItem("email");
  const localName = localStorage.getItem("fullname");

  useEffect(() => {

    if (localEmail) {
      setEmail(localEmail);
    }
    if (localName) {
      setFullName(localName);
    }
  }, []);

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  // Handle country selection and fetch states for the selected country
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    const countryIsoCode = selectedOption.value;
    const statesList = State.getStatesOfCountry(countryIsoCode).map(
      (state) => ({
        label: state.name,
        value: state.isoCode,
      })
    );
    setStates(statesList); // Populate states based on country
    setSelectedState(null); // Reset state when country changes
  };

  // Handle state selection
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Ensure all address-related fields are filled
    if (
      !street ||
      !city ||
      !postalCode ||
      !address ||
      !selectedCountry ||
      !selectedState
    ) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const localCartList =
      JSON.parse(localStorage.getItem("localCartList")) || [];

    const itemsData = localCartList.map((item) => ({
      productId: item._id,
      quantity: item.newquantity,
      amount: item.price,
    }));

    try {
      const response = await axios.post(
        `${apiUrl}/api/pay`,
        {
          email,
          fullName,
          amount: total,
          itemsData,
          redirectUrl: `${process.env.REACT_APP_URL}/verify`,
          selectedCountry,
          selectedState,
          address,
          city,
          street,
          postalCode,
          currency: countryCode === "NG" ? "NGN" : "USD",
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
     
        window.location.href = response.data.data.authorization_url;
      } else {
        toast.error("Payment initialization failed.");
      }
    } catch (error) {
      toast.error("Error initializing payment");
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused
        ? "var(--navcolor)"
        : "rgba(13, 13, 77, 0.2)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--navcolor)" : "none",
      "&:hover": {
        borderColor: "var(--navcolor)",
      },
      borderRadius: "8px",
      padding: "4px",
      fontSize: "1rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--navcolor)"
        : state.isFocused
        ? "rgba(13, 13, 77, 0.1)"
        : null,
      color: state.isSelected ? "white" : "var(--navcolor)",
    }),
  };

  return (
    <div className="checkout-page">
      {authenticated ? (
        <div className="checkout-container">
          <div className="checkout-main">
            <div className="checkout-form-container">
              <div className="checkout-header">
                <h2>Checkout</h2>
                <p>Complete your order by providing your shipping details</p>
              </div>

              <form className="checkout-form" onSubmit={handlePayment}>
                <div className="checkout-form-details">
                  <div className="checkout-total-banner">
                    <div className="total-icon">
                      <DollarSign size={20} />
                    </div>
                    <div className="total-text">
                      <span>Total Amount</span>
                      <h3>${total}</h3>
                    </div>
                  </div>

                  <div className="shipping-info">
                    <div className="section-header">
                      <Truck size={18} />
                      <h3>Shipping Information</h3>
                    </div>

                    <div className="shipping-note">
                      <p>
                        Working with DHL, we deliver worldwide. No matter where
                        you are, we can ship to you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-fields">
                  <div
                    className={`form-group ${
                      focused === "fullName" ? "focused" : ""
                    } ${fullName ? "has-value" : ""}`}
                  >
                    <div className="input-icon">
                      <User size={18} />
                    </div>
                    <input
                      className="input-field"
                      type="text"
                      id="fullName"
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      placeholder="Full Name"
                      onFocus={() => handleFocus("fullName")}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="fullName">Full Name</label>
                  </div>

                  <div
                    className={`form-group ${
                      focused === "email" ? "focused" : ""
                    } ${email ? "has-value" : ""}`}
                  >
                    <div className="input-icon">
                      <Mail size={18} />
                    </div>
                    <input
                      className="input-field"
                      type="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      placeholder="Email Address"
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="email">Email Address</label>
                  </div>

                  <div
                    className={`form-group ${
                      focused === "phone" ? "focused" : ""
                    } ${phone ? "has-value" : ""}`}
                  >
                    <div className="input-icon">
                      <Phone size={18} />
                    </div>
                    <input
                      className="input-field"
                      type="tel"
                      id="phone"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                      onFocus={() => handleFocus("phone")}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="phone">Phone Number</label>
                  </div>

                  <div className="form-group select-group">
                    <div className="input-icon">
                      <Globe size={18} />
                    </div>
                    <label className="select-label">Country</label>
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Select a country"
                      isSearchable
                      styles={selectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                    />
                  </div>

                  <div className="form-group select-group">
                    <div className="input-icon">
                      <Building size={18} />
                    </div>
                    <label className="select-label">State/Province</label>
                    <Select
                      options={states}
                      value={selectedState}
                      onChange={handleStateChange}
                      placeholder={
                        selectedCountry
                          ? "Select a state/province"
                          : "Select a country first"
                      }
                      isSearchable
                      isDisabled={!selectedCountry}
                      styles={selectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      required
                    />
                  </div>

                  <div
                    className={`form-group ${
                      focused === "street" ? "focused" : ""
                    } ${street ? "has-value" : ""}`}
                  >
                    <div className="input-icon">
                      <MapPin size={18} />
                    </div>
                    <input
                      className="input-field"
                      type="text"
                      id="street"
                      onChange={(e) => setStreet(e.target.value)}
                      value={street}
                      placeholder="Street"
                      onFocus={() => handleFocus("street")}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="street">Street</label>
                  </div>

                  <div
                    className={`form-group ${
                      focused === "city" ? "focused" : ""
                    } ${city ? "has-value" : ""}`}
                  >
                    <div className="input-icon">
                      <Building size={18} />
                    </div>
                    <input
                      className="input-field"
                      type="text"
                      id="city"
                      onChange={(e) => setCity(e.target.value)}
                      value={city}
                      placeholder="City"
                      onFocus={() => handleFocus("city")}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="city">City</label>
                  </div>

                  <div
                    className={`form-group ${
                      focused === "postalCode" ? "focused" : ""
                    } ${postalCode ? "has-value" : ""}`}
                  >
                    <div className="input-icon">
                      <MapPin size={18} />
                    </div>
                    <input
                      className="input-field"
                      type="text"
                      id="postalCode"
                      onChange={(e) => setPostalCode(e.target.value)}
                      value={postalCode}
                      placeholder="Postal Code"
                      onFocus={() => handleFocus("postalCode")}
                      onBlur={handleBlur}
                      required
                    />
                    <label htmlFor="postalCode">Postal Code</label>
                  </div>

                  <div
                    className={`form-group ${
                      focused === "address" ? "focused" : ""
                    } ${address ? "has-value" : ""}`}
                  >
                    <div className="input-icon textarea-icon">
                      <MapPin size={18} />
                    </div>
                    <textarea
                      className="input-field textarea"
                      id="address"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                      onFocus={() => handleFocus("address")}
                      onBlur={handleBlur}
                      required
                    ></textarea>
                    <label htmlFor="address">Delivery Address</label>
                  </div>
                </div>

                <button type="submit" className="payment-button">
                  <span>Proceed to Payment</span>
                  <CreditCard size={18} />
                </button>
              </form>
            </div>

            <div className="order-summary">
              <div className="summary-header">
                <ShoppingBag size={20} />
                <h3>Order Summary</h3>
              </div>

              <div className="summary-items">
                {initialItems.map((item, index) => (
                  <div className="summary-item" key={item._id}>
                    <div className="summary-item-image">
                      <Link to={`/${item._id}`}>
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.name}
                        />
                      </Link>
                    </div>

                    <div className="summary-item-details">
                      <p className="item-type">
                        <span>Material:</span> {item.type}
                      </p>

                      <div className="item-quantity">
                        <span>Quantity:</span> {item.newquantity}
                        {initialItems[index]?.name === "fabric" ? (
                          initialItems[index]?.newquantity === 1 ? (
                            <small> yard</small>
                          ) : (
                            <small> yards</small>
                          )
                        ) : (
                          ""
                        )}
                      </div>

                      <p className="item-price">
                        <span>Price:</span> ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-total">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Calculated at payment</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-required">
          <div className="auth-message">
            <ShoppingBag size={40} />
            <h2>Sign in to complete your purchase</h2>
            <p>
              Please <Link to="/login">Login</Link> or{" "}
              <Link to="/signup">Sign Up</Link> to proceed to checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
