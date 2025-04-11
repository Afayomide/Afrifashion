import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CurrencyContext = createContext({
  currency: "$",
  countryCode: "",
  exchangeRate: null, // Default to USD
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("$");
  const [countryCode, setCountryCode] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null); // USD as base

  useEffect(() => {
    const fetchCurrencyInfo = async () => {
      try {
        // 1. Get user country
        const res = await fetch("http://ip-api.com/json");
        
        const data = await res.json();
        const code = data.countryCode;

        setCountryCode(code);
        const isNigeria = code === "NG";
        setCurrency(isNigeria ? "₦" : "$");

        // 2. Fetch exchange rate if Nigerian
        if (isNigeria) {
          try {
            const rateRes = await axios.get(
              "https://api.exchangerate-api.com/v4/latest/USD"
            );
            const nairaRate = rateRes.data?.rates?.NGN;

            if (nairaRate) {
              setExchangeRate(nairaRate);
            } else {
              setExchangeRate(1600); // fallback rate
            }
          } catch (err) {
            console.error("Exchange rate fetch failed:", err);
            setExchangeRate(1600); // fallback rate
          }
        } else {
          setExchangeRate(1); // USD users get default rate
        }
      } catch (err) {
        console.error("Location fetch failed:", err);
        setCurrency("₦");
        setExchangeRate(1600); // fallback values
      }
    };

    fetchCurrencyInfo();
  }, []);


  return (
    <CurrencyContext.Provider value={{ currency, countryCode, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};
