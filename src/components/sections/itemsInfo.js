"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
  DollarSign,
  FactoryIcon as Fabric,
  Info,
  Phone,
  MessageSquare,
  Loader,
} from "lucide-react";

export default function ItemsInfo() {
  const [item, setItem] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [relatedItems, setRelatedItems] = useState([]);
  const [error, setError] = useState("");
  const {
    cartList,
    setCartList,
    setInitialItems,
    initialItems,
    setLocalCartLength,
    setShouldFetchCart,
    setCartNo,
    authenticated,
  } = useContext(ProductContext);
  const { id } = useParams();
  const [selectedQuantity, setSelectedQuantity] = useState(() => {
    const storedQuantity = JSON.parse(
      localStorage.getItem(`selectedQuantity-${id}`)
    );
    return storedQuantity || 1; // Default to 1 if no stored quantity
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        const ItemInfo = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/aboutItem/${id}`
        );
        const relatedResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/related-Items/${id}`
        );
        setItem(ItemInfo.data.item);
        setRelatedItems(relatedResponse.data.relatedItems);
      } catch (err) {
        console.error("Error fetching item data:", err);
        setError("Failed to load product information. Please try again later.");
      }
    }
    fetchData();
    // Reset image loaded state when ID changes
    setIsImageLoaded(false);
  }, [id]);

  const clickedList =
    JSON.parse(localStorage.getItem("localClickedList")) || [];

  const handleQuantityChange = (id, newQuantity, price) => {
    function updateClickedList() {
      const updatedClickedList = [...clickedList];
      const clickedItemToUpdate = updatedClickedList.find(
        (clickedItem) => clickedItem._id === id
      );
      clickedItemToUpdate.newquantity = newQuantity;
      clickedItemToUpdate.newprice = newQuantity * clickedItemToUpdate.price;

      localStorage.setItem(
        "localClickedList",
        JSON.stringify(updatedClickedList)
      );
    }

    setSelectedQuantity(newQuantity);

    localStorage.setItem(`selectedQuantity-${id}`, JSON.stringify(newQuantity));

    if (Array.isArray(cartList) && cartList.find((item) => item._id == id)) {
      const matchingCartItem = cartList.find((cartItem) => cartItem._id === id);

      if (!matchingCartItem) {
        console.error("Item with id", id, "not found in cartList");
        return updateClickedList();
      }

      const updatedCartList = [...cartList];
      matchingCartItem.quantity = newQuantity;
      matchingCartItem.price = price * newQuantity;

      const matchingInitialItem =
        Array.isArray(initialItems) &&
        initialItems.find((initialItem) => initialItem._id === id);

      if (!matchingInitialItem) {
        console.error("Item with id", id, "not found in initialItems");
        return updateClickedList();
      }

      const updatedInitialItems = [...initialItems];
      updatedInitialItems.find(
        (initialItem) => initialItem._id === id
      ).newquantity = newQuantity;
      updatedInitialItems.find((initialItem) => initialItem._id === id).price =
        newQuantity * item.price;

      setCartList(updatedCartList);
      setInitialItems(updatedInitialItems);

      localStorage.setItem(
        "localCartList",
        JSON.stringify(updatedInitialItems)
      );
    }
    if (
      Array.isArray(clickedList) &&
      clickedList.find((item) => item._id === id)
    ) {
      updateClickedList();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const productId = item._id;

    try {
      const updatedLocalCartList = JSON.parse(
        localStorage.getItem("localCartList")
      ).filter((cartItem) => cartItem._id !== productId);
      localStorage.setItem(
        "localCartList",
        JSON.stringify(updatedLocalCartList)
      );
      setInitialItems(updatedLocalCartList);
      setCartList(updatedLocalCartList);
      setLocalCartLength(updatedLocalCartList.length);

      if (authenticated) {
        const fetchUrl = `${process.env.REACT_APP_API_URL}/api/cart/delete`;
        await axios.delete(fetchUrl, {
          data: { productId },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Correct way to send token
          },
        });
      }
    } catch (error) {
      console.error("Error deleting from cart:", error);
      setError("An error occurred while deleting from cart.");

      const storedCartList =
        JSON.parse(localStorage.getItem("localCartList")) || [];
      storedCartList.push(item);
      localStorage.setItem("localCartList", JSON.stringify(storedCartList));
      setLocalCartLength(storedCartList.length);
      throw error;
    }
  };

  const handleAddToCart = async (fabric) => {
    const storedCartList =
      JSON.parse(localStorage.getItem("localCartList")) || [];
    const clickedCartList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];

    const clickedItem = clickedCartList.find((item) => item._id === fabric._id);
    const fabricWithQuantity = {
      ...fabric,
      newquantity: clickedItem ? clickedItem.newquantity : 1,
      price: clickedItem ? clickedItem.newprice : fabric.price,
    };

    // Check if the item already exists in the local cart
    const existingItemIndex = storedCartList.findIndex(
      (item) => item._id === fabric._id
    );
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      storedCartList[existingItemIndex].newquantity =
        fabricWithQuantity.newquantity;
    } else {
      // Add new item if it doesn't exist
      storedCartList.push(fabricWithQuantity);
    }

    localStorage.setItem("localCartList", JSON.stringify(storedCartList));
    setLocalCartLength(storedCartList.length);
    setCartNo(storedCartList.length);

    if (authenticated) {
      try {
        const productId = fabric._id;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/add`,
          {
            productId,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Correct way to send token
            },
          }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
        setError("An error occurred while adding to cart.");

        // If there's an error, remove the item from local storage
        const updatedCartList = storedCartList.filter(
          (item) => item._id !== fabric._id
        );
        localStorage.setItem("localCartList", JSON.stringify(updatedCartList));
        setLocalCartLength(updatedCartList.length);
      } finally {
        setShouldFetchCart(true);
      }
    }
  };

  function localClickedList(fabric) {
    const clickedList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];
    const clickedItemId = clickedList.find((item) => item._id === fabric._id);
    if (!clickedItemId) {
      const clickedItem = { ...fabric, newquantity: 1 };
      clickedList.push(clickedItem);
    }
    scrollToTop();
    localStorage.setItem("localClickedList", JSON.stringify(clickedList));
  }

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const isInCart =
    cartList.some((cartItem) => cartItem._id === item._id) ||
    (JSON.parse(localStorage.getItem("localCartList")) || []).some(
      (storedCartItem) => storedCartItem._id === item._id
    );

  return (
    <div className="product-page-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
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
            {item.images && (
              <img
                className={`item-info-img ${isImageLoaded ? "loaded" : ""}`}
                src={item.images[0] || "/placeholder.svg"}
                alt={item.type || "Product image"}
                onLoad={handleImageLoad}
              />
            )}
          </div>

          <button
            onClick={() =>
              isInCart ? handleDelete(item) : handleAddToCart(item)
            }
            className={`items-info-cart-button ${
              isInCart ? "remove-button" : "add-button"
            }`}
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

          <div className="price-badge">
            <DollarSign size={18} />
            <span>{item.price}</span>
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
                onChange={(e) =>
                  handleQuantityChange(id, Number.parseInt(e.target.value))
                }
                value={
                  (Array.isArray(initialItems) &&
                    initialItems.find((item) => item._id == id)?.newquantity) ||
                  (Array.isArray(clickedList) &&
                    clickedList.find((item) => item._id == id)?.newquantity) ||
                  selectedQuantity
                }
              >
                {Array.from(
                  {
                    length: item.quantity || 1,
                  },
                  (_, i) => i + 1
                ).map((optionValue) => (
                  <option key={optionValue} value={optionValue}>
                    {optionValue}
                  </option>
                ))}
              </select>
              <span className="unit-label">
                {item.name === "fabric"
                  ? selectedQuantity === 1
                    ? "yard"
                    : "yards"
                  : ""}
              </span>
            </div>
          </div>

          <div className="product-info-section">
            <span>Total Price: </span>
            <p className="total-price">
              $
              {clickedList.find((clickedItem) => clickedItem._id === id)
                ?.newprice ||
                initialItems.find((item) => item._id == id)?.price ||
                item.price}
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
              <a href="/contact" className="contact-link">
                Contact our wholesales team
              </a>
              or call{" "}
              <a href="tel:+234-8142360551" className="phone-link">
                <Phone size={14} /> +234-8142360551
              </a>
            </p>
          </div>

          {item.instructions && (
            <div className="product-info-section instructions-section">
              <div className="info-label">
                <Info size={16} />
                <span>Instructions</span>
              </div>
              <p>{item.instructions}</p>
            </div>
          )}
        </div>
      </div>

      <div className="related-items">
        <div className="section-header">
          <ShoppingBag size={20} />
          <h2>More Like This</h2>
        </div>

        <div className="related-container">
          <div className="swiper-button-prev-custom">
            <ChevronLeft size={20} />
          </div>
          <div className="swiper-button-next-custom">
            <ChevronRight size={20} />
          </div>

          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
            }}
          >
            {relatedItems?.map((item) => (
              <SwiperSlide key={item._id}>
                <div
                  className={`related-product-list ${
                    item.status === "in stock" ? "out-of-stock" : ""
                  }`}
                >
                  <Link
                    onClick={() =>
                      item.status === "in stock" && localClickedList(item)
                    }
                    className={`related-product-link ${
                      item.status === "in stock" ? "disabled-link" : ""
                    }`}
                    to={item.status === "in stock" ? `/${item._id}` : "#"}
                  >
                    <div className="related-product-image">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.type}
                        className={
                          item.status === "in stock" ? "out-of-stock-img" : ""
                        }
                      />
                    </div>
                    <div className="related-product-info">
                      <h3 className="related-product-title">{item.type}</h3>
                      <div className="related-product-price">
                        <span className="price-value">${item.price}</span> per
                        yard
                      </div>
                      <div className="related-product-stock">
                        <span className="stock-value">{item.quantity}</span>{" "}
                        yards left
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
