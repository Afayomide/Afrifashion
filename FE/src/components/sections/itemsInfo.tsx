"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import "./itemsInfo.scss";
import { ProductContext } from "../productContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation, A11y, Pagination } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ShoppingBag,
  Trash2,
  Tag,
  FactoryIcon as Fabric,
  Info,
  Phone,
  MessageSquare,
  Loader,
} from "lucide-react";
import { applyExchangeRate } from "../currency/exchangeRate";
import { useCurrency } from "../currency/currencyContext";
import ProductCard from "../cards/ProductCard";

export default function ItemsInfo({ initialData, id: productId }: { initialData: any, id: string }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [fetchError, setFetchError] = useState("");
  
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useContext(ProductContext)!;

  const { exchangeRate, currency } = useCurrency();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const displayItem = useMemo(() => {
    if (!initialData?.item) return null;
    if (!exchangeRate) return initialData.item;
    return applyExchangeRate(initialData.item, exchangeRate);
  }, [initialData, exchangeRate]);

  const displayRelatedItems = useMemo(() => {
    if (!initialData?.relatedItems) return [];
    if (!exchangeRate) return initialData.relatedItems;
    return applyExchangeRate(initialData.relatedItems, exchangeRate);
  }, [initialData, exchangeRate]);

  const cartItem = useMemo(() => {
    const idToFind = displayItem?._id || productId;
    return cartItems.find((i: any) => i._id === idToFind);
  }, [cartItems, displayItem, productId]);

  useEffect(() => {
    if (cartItem) {
      setSelectedQuantity(cartItem.cartQuantity);
    }
  }, [cartItem]);

  const handleQuantityChange = (newQuantity: number) => {
    setSelectedQuantity(newQuantity);
    if (cartItem) {
      updateQuantity(cartItem._id, newQuantity);
    }
  };

  const handleToggleCart = async () => {
    if (cartItem) {
      await removeFromCart(cartItem._id);
    } else {
      await addToCart({ ...displayItem, cartQuantity: selectedQuantity });
    }
  };

  if (!displayItem) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const item = displayItem;
  const relatedItems = displayRelatedItems;
  const isInCart = !!cartItem;

  return (
    <div className="product-page-container">
      {fetchError && (
        <div className="error-message">
          <p>{fetchError}</p>
        </div>
      )}

      <div className="item-info">
        <div className="item-info-img-container">
          <div className="item-info-image-wrapper">
            {!isImageLoaded && (
              <div className="item-image-loader-container">
                <Loader size={40} className="item-image-spinner" />
              </div>
            )}
            <img
              className={`item-info-img ${isImageLoaded ? "loaded" : ""}`}
              src={item.images?.[0] || "/placeholder.svg"}
              alt={item.type || "Product image"}
              onLoad={() => setIsImageLoaded(true)}
            />
            {item.discountPrice && item.discountPrice < item.price && (
              <div className="discount-badge">
                <Tag size={12} />
                <span>
                  {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleToggleCart}
            className={`items-info-cart-button ${isInCart ? "remove-button" : "add-button"}`}
          >
            {isInCart ? (
              <>
                <Trash2 size={18} />
                <span>Remove From Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add To Cart</span>
              </>
            )}
          </button>
        </div>

        <div className="item-details">
          <h1 className="product-title">{item.type}</h1>

          <div className="price-container">
            {item.discountPrice && item.discountPrice < item.price ? (
              <>
                <div className="price-badge">
                  <span className="original-price">
                    {currency}{item.price.toLocaleString()}
                  </span>
                </div>
                <div className="price-badge discount-price-badge">
                  <span>
                    {currency}{item.discountPrice.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="price-badge original-price-no-discount">
                <span>
                  {currency}{item.price.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="info-label">
              <Fabric size={16} />
              <span>Material</span>
            </div>
            <p>{item.material}</p>
          </div>

          <div className="product-info-section">
            <div className="info-label">
              <Tag size={16} />
              <span>Quantity</span>
            </div>
            <div className="quantity-selector">
              <select
                className="quantity-input"
                onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value))}
                value={selectedQuantity}
              >
                {Array.from({ length: item.quantity || 1 }, (_, i) => i + 1).map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <span className="unit-label">
                {item.name === "fabric" ? (selectedQuantity === 1 ? "yard" : "yards") : ""}
              </span>
            </div>
          </div>

          <div className="product-info-section">
            <div className="info-label">
              <span>Total Price :</span>
            </div>
            <p className="total-price">
              {currency}
              {((item.discountPrice || item.price) * selectedQuantity).toLocaleString()}
            </p>
          </div>

          <div className="product-info-section description-section">
            <div className="info-label">
              <Info size={16} />
              <span>Description</span>
            </div>
            <p className="description">{item.description}</p>
          </div>

          <div className="product-info-section contact-section">
            <p>
              <MessageSquare size={16} />
              <span>Need a special order?</span>
              <Link href="/contact" className="contact-link">Contact our wholesales team</Link>
              or call{" "}
              <a href="tel:+234-8142360551" className="phone-link">
                <Phone size={14} /> +234-8142360551
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="related-items">
        <div className="section-header">
          <ShoppingBag size={20} />
          <h2>More Like This</h2>
        </div>

        <div className="related-container">
          <div className="swiper-button-prev-custom"><ChevronLeft size={20} /></div>
          <div className="swiper-button-next-custom"><ChevronRight size={20} /></div>

          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation={{ nextEl: ".swiper-button-next-custom", prevEl: ".swiper-button-prev-custom" }}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 25 },
            }}
          >
            {relatedItems?.map((relItem: any) => (
              <SwiperSlide key={relItem._id}>
                <ProductCard {...relItem} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}