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
        const res= await fetch("https://geolocation-db.com/json/");

        const data = await res.json();
        const code = data.country_code;

        setCountryCode(code);
        const isNigeria = code === "NG";
        setCurrency(isNigeria ? "₦" : "$");

        // 2. Fetch exchange rate if Nigerian
        if (isNigeria) {
          try {
            // const rateRes = await fetch(
            //   "https://open.er-api.com/v6/latest/USD"
            // );
            // const rateData = await rateRes.json();
            const nairaRate = 1600

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
