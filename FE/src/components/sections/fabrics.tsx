"use client";

import { useEffect, memo, useMemo, useState } from "react";
import { useContext } from "react";
import useFabricStore from "../stores/useFabricStore";
import { ProductContext } from "../productContext";
import "./sections.css";
import formbg from "../../assets/formbg.webp";
import ProductCard from "../cards/ProductCard";
import CategoryNav from "../categoryNav/categoryNav";
import { useCurrency } from "../currency/currencyContext";
import { applyExchangeRate } from "../currency/exchangeRate";
import Image from "next/image";

const Fabrics = memo(({ initialData }: { initialData: any[] }) => {
  const { fabricsList, isLoading, error, fetchFabrics } = useFabricStore();
  const { mainLoading } = useContext(ProductContext);
  const { exchangeRate } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only fetch fabrics when exchangeRate is available
    if (exchangeRate) {
      fetchFabrics(exchangeRate);

      // Set up an interval to refetch fabrics every 30 seconds
      const interval = setInterval(() => {
        if (exchangeRate) fetchFabrics(exchangeRate); // Check again if exchangeRate is available
      }, 30000);

      return () => clearInterval(interval); // Clean up the interval on unmount
    }
  }, [exchangeRate, fetchFabrics]);

  const displayFabrics = useMemo(() => {
    const list = fabricsList.length > 0 ? fabricsList : initialData;
    if (!list) return [];
    if (!mounted || !exchangeRate) return list;
    return applyExchangeRate(list, exchangeRate);
  }, [fabricsList, initialData, exchangeRate, mounted]);

  const renderedCards = useMemo(() => {
    return displayFabrics.map((item: any) => <ProductCard key={item._id} {...item} />);
  }, [displayFabrics]);



  return (
    <>
      <CategoryNav />
      <div className="category-nav-placeholder"></div>
      
      {displayFabrics.length > 0 ? (
        <div className="products-grid">{renderedCards}</div>
      ) : isLoading ? (
        <div className="message">
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
          <p className="loading-message">....Getting all fabrics</p>
        </div>
      ) : error ? (
        <div className="message">
          <Image
            className="error-image"
            src={formbg}
            alt="error background"
          />
          <p className="error-message">Error: {error}</p>
        </div>
      ) : (
        <div className="message">
          <p className="loading-message">No fabric found</p>
        </div>
      )}
    </>
  );

});

export default Fabrics;
