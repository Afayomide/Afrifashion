"use client";

import { useEffect, memo, useMemo } from "react";
import { useContext } from "react";
import useFabricStore from "../stores/useFabricStore";
import { ProductContext } from "../productContext";
import "./sections.css";
import formbg from "../../assets/formbg.webp";
import { Card } from "../cards/sectionCard";
import CategoryNav from "../categoryNav/categoryNav";

const Fabrics = memo(() => {
  const { fabricsList, isLoading, error, fetchFabrics } = useFabricStore();
  const { mainLoading, setCartList } = useContext(ProductContext);

  useEffect(() => {
    if (mainLoading) {
      fetchFabrics();
      const interval = setInterval(fetchFabrics, 30000);
      return () => clearInterval(interval);
    }
  }, [mainLoading]);

  const renderedCards = useMemo(() => {
    return fabricsList.map((item) => <Card key={item._id} {...item} />);
  }, [fabricsList]);

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
            <p className="loading-message">....Getting all fabrics</p>
          </div>
        ) : error ? (
          <div className="message">
            <img
              className="error-image"
              src={formbg || "/placeholder.svg"}
              alt="error background"
            />
            <p className="error-message">Error: {error}</p>
          </div>
        ) : fabricsList.length > 0 ? (
          <div className="product-list-container">{renderedCards}</div>
        ) : (
          <div className="message">
            <p className="loading-message">No fabric found</p>
          </div>
        )}
      </div>
    </>
  );
});

export default Fabrics;
