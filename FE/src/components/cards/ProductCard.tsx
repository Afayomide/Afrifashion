"use client";

import { memo, useEffect, useState, useContext, useRef } from "react";
import Preloader from "../../preloader";
import { ProductContext } from "../productContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingCart, Check, AlertCircle, Package, Tag } from "lucide-react";
import { useCurrency } from "../currency/currencyContext";
import { localClickedList } from "../clickedList";
import "./cards.css";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const ProductCard = memo(function ProductCard(props: any) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { currency } = useCurrency();
  const { authenticated, addToCart, cartItems } =
    useContext(ProductContext)!;
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async (fabric: any) => {
    await addToCart(fabric);
  };

  const isInCart = cartItems.some((item: any) => item._id === props._id);

  const hasDiscount = props.discountPrice && props.discountPrice < props.price;
  const discountPercentage = hasDiscount
    ? Math.round(((props.price - props.discountPrice) / props.price) * 100)
    : 0;

  const productUrl = props.slug ? `/${props.slug}` : `/${props._id}`;

  return (
    <div
      ref={cardRef}
      className={`product-card fade-up ${isVisible ? "visible" : ""} ${
        props.status === "out of stock" ? "out-of-stock" : ""
      }`}
    >
      <Link
        href={props.status !== "out of stock" ? productUrl : "#"}
        onClick={() => props.status !== "out of stock" && localClickedList(props)}
        className="card-link"
      >
        <div className="card-image-wrapper">
          {!isImageLoaded && <Preloader />}
          <img
            src={props.images?.[0] || "/placeholder.svg"}
            alt={props.name || props.type}
            className={`card-image ${!isImageLoaded ? "hidden" : ""}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {hasDiscount && (
            <div className="card-badge">
              <Tag size={12} />
              <span>{discountPercentage}% OFF</span>
            </div>
          )}

          {props.status === "out of stock" && (
            <div className="stock-overlay">
              <span className="stock-tag">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="card-content">
          <span className="card-category">{props.type}</span>
          <h3 className="card-title">{props.name || props.type}</h3>
          
          <div className="card-price-row">
            {hasDiscount ? (
              <>
                <span className="current-price">{currency}{props.discountPrice.toLocaleString()}</span>
                <span className="old-price">{currency}{props.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="current-price">{currency}{props.price.toLocaleString()}</span>
            )}
            <span className="price-unit">/ yard</span>
          </div>

          <div className="card-stock-info">
            <span>{props.quantity} yards left</span>
          </div>
        </div>
      </Link>

      <div className="card-actions">
        {isInCart ? (
          <button
            onClick={() => router.push(`/${props._id}`)}
            className="action-button btn-added"
          >
            <Check size={18} />
            <span>In Cart</span>
          </button>
        ) : props.status !== "out of stock" ? (
          <button
            className="action-button btn-add"
            onClick={() => handleAddToCart(props)}
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        ) : (
          <button className="action-button btn-out" disabled>
            <AlertCircle size={18} />
            <span>Sold Out</span>
          </button>
        )}
      </div>
    </div>
  );
});

export default ProductCard;
