"use client";

import { ProductContext } from "../productContext";
import { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import formbg from "../../assets/formbg.webp";
import ProductCard from "../cards/ProductCard";
import CategoryNav from "../categoryNav/categoryNav";
import { useCurrency } from "../currency/currencyContext";
import { applyExchangeRate } from "../currency/exchangeRate";

function SearchResults({ initialData = [], searchTerm: serverSearchTerm }: { initialData?: any[], searchTerm?: string }) {
  const { setShouldSearch } = useContext(ProductContext)!;
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || serverSearchTerm;
  const { exchangeRate } = useCurrency();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isExchangeRateReady, setIsExchangeRateReady] = useState(false);

  useEffect(() => {
    if (exchangeRate) {
      setIsExchangeRateReady(true);
    }
  }, [exchangeRate]);

  const fetchSearchResults = async () => {
    if (!searchTerm) return []; 

    const response = await axios.post(
      `${apiUrl}/api/search`,
      { searchTerm }
    );

    const results = response.data.result;
    return results;
  };

  const {
    data: rawResults = initialData,
    isLoading,
    error,
    isSuccess
  } = useQuery({
    queryKey: ["searchResults", searchTerm],
    queryFn: fetchSearchResults,
    enabled: !!searchTerm && mounted, // Only fetch on client if searchTerm exists and mounted
    initialData: searchTerm === serverSearchTerm ? initialData : undefined,
    staleTime: 2 * 60 * 1000,
  });

  const searchResult = useMemo(() => {
    if (!rawResults) return [];
    if (!mounted || !exchangeRate) return rawResults;
    return applyExchangeRate(rawResults, exchangeRate);
  }, [rawResults, exchangeRate, mounted]);

  useEffect(() => {
    if (isSuccess) {
      setShouldSearch(false);
    }
  }, [isSuccess, setShouldSearch]);

  return (
    <>
      <CategoryNav />
      <div className="category-nav-placeholder"></div>
      
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
            src={formbg.src || "/placeholder.svg"}
            alt="login background"
            className="auth-bg-image"
          />
          <img
            className="error-image"
            src={formbg.src || "/placeholder.svg"}
            alt="Error"
          />
          <p className="error-message">Error: {error.message}</p>
        </div>
      ) : searchResult.length > 0 ? (
        <>
          <h3 className="search-header">Search Results for "{searchTerm}"</h3>
          <div className="products-grid">
            {searchResult.map((item: any) => (
              <ProductCard key={item._id} {...item} />
            ))}
          </div>
        </>
      ) : (
        <div className="message">
          <p className="loading-message">
            We found nothing for "{searchTerm}"
          </p>
        </div>
      )}
    </>
  );
}

export default SearchResults;
