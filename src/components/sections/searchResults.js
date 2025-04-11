"use client";

import { ProductContext } from "../productContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import formbg from "../../assets/formbg.webp";
import { Card } from "../cards/sectionCard";
import CategoryNav from "../categoryNav/categoryNav";
import { useCurrency } from "../currency/currencyContext";
import { applyExchangeRate } from "../currency/exchangeRate";

function SearchResults() {
  const { shouldSearch, setShouldSearch } = useContext(ProductContext);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("q");
  const { exchangeRate } = useCurrency();
  

 

const [isExchangeRateReady, setIsExchangeRateReady] = useState(false);

useEffect(() => {
  if (exchangeRate) {
    setIsExchangeRateReady(true);
  }
}, [exchangeRate]);

const fetchSearchResults = async () => {
  if (!searchTerm || !isExchangeRateReady) return []; // Don't fetch until exchangeRate is available

  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/search`,
    { searchTerm }
  );

  const results = response.data.result;

  return applyExchangeRate(results, exchangeRate);
};

const {
  data: searchResult = [],
  isLoading,
  error,
} = useQuery({
  queryKey: ["searchResults", searchTerm],
  queryFn: fetchSearchResults,
  enabled: !!searchTerm && isExchangeRateReady, // Only enable query if searchTerm and exchangeRate are available
  staleTime: 2 * 60 * 1000,
  refetchInterval: 2 * 60 * 1000,
  onSuccess: () => setShouldSearch(false),
});

  return (
    <>
      <CategoryNav />
      <div className="category-nav-placeholder"></div>
      <div className="product-list-container">
        {isLoading ? (
          <div className="message">
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
            <p className="loading-message">....searching</p>
          </div>
        ) : error ? (
          <div className="message">
            <img
              src={formbg || "/placeholder.svg"}
              alt="login background"
              className="auth-bg-image"
            />
            <img
              className="error-image"
              src={formbg || "/placeholder.svg"}
              alt="Error"
            />
            <p className="error-message">Error: {error.message}</p>
          </div>
        ) : searchResult.length > 0 ? (
          <div>
            <h3 className="search-header">Search Results for "{searchTerm}"</h3>
            <div className="product-list-container">
              {searchResult.map((item) => (
                <Card key={item._id} {...item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="message">
            <p className="loading-message">
              We found nothing for "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchResults;
