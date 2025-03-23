import { useContext, useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./itemsInfo.scss";
import { ProductContext } from "../productContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation, A11y, Pagination } from "swiper/modules";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";

export default function ItemsInfo() {
  const [item, setItem] = useState([]);
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

  useEffect(() => {
    async function fetchData() {
      console.log(id);
      const ItemInfo = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/aboutItem/${id}`
      );
      const relatedResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/related-Items/${id}`
      );
      console.log(relatedResponse);
      setItem(ItemInfo.data.item);
      setRelatedItems(relatedResponse.data.relatedItems);
    }
    fetchData();
  }, [id]);

  const clickedList =
    JSON.parse(localStorage.getItem("localClickedList")) || [];

  const handleQuantityChange = (id, newQuantity, price) => {
    function updateClickedList() {
      console.log("Item found in clickedList");

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

      console.log("Updated clickedCartList:", updatedClickedList);
    }

    setSelectedQuantity(newQuantity);

    localStorage.setItem(`selectedQuantity-${id}`, JSON.stringify(newQuantity));

    if (Array.isArray(cartList) && cartList.find((item) => item._id == id)) {
      const matchingCartItem = cartList.find((cartItem) => cartItem._id === id);

      if (!matchingCartItem) {
        console.error("Item with id", id, "not found in cartList");
        console.log("cartlist:", cartList);
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
        console.log("initialItem:", initialItems);
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
      console.log(updatedCartList);
      console.log(updatedInitialItems);
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
      top: 0, // Scroll to the top of the page
      behavior: "smooth", // Optional: smooth scrolling
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
        });
      }
    } catch (error) {
      console.error("Error deleting from cart:", error);
      setError("An error occurred while deleting from cart.");

      const storedCartList =
        JSON.parse(localStorage.getItem("localCartList")) || [];
      storedCartList.push(item);
      localStorage.setItem("localCartList", JSON.stringify(storedCartList));
      console.log("Added item back to local cart:", item);
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
    console.log("Updated local cart:", storedCartList);

    setLocalCartLength(storedCartList.length);
    setCartNo(storedCartList.length);

    if (authenticated) {
      try {
        const productId = fabric._id;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/cart/add`,
          { productId }
        );

        console.log("Added fabric to server cart:", response.data);
      } catch (error) {
        console.error("Error adding to cart:", error);
        setError("An error occurred while adding to cart.");

        // If there's an error, remove the item from local storage
        const updatedCartList = storedCartList.filter(
          (item) => item._id !== fabric._id
        );
        localStorage.setItem("localCartList", JSON.stringify(updatedCartList));
        console.log("Removed fabric from local cart:", fabric);
        setLocalCartLength(updatedCartList.length);
      } finally {
        setShouldFetchCart(true);
      }
    }
  };
  function localClickedList(fabric) {
    const clickedList =
      JSON.parse(localStorage.getItem("localClickedList")) || [];
    const clickedItemId = clickedList.find((item) => item._id === fabric._id); // Assuming 'id' is unique for each fabric
    if (clickedItemId) {
    } else {
      const clickedItem = { ...fabric, newquantity: 1 };
      clickedList.push(clickedItem);
    }
    scrollToTop();
    localStorage.setItem("localClickedList", JSON.stringify(clickedList));
  }

  return (
    <div>
      <div className="item-info">
        <div className="item-info-img-container">
          {item.image ? (
            <img className="item-info-img" src={item.image} alt={item.name} />
          ) : (
            <div className="loader">
              <div className="item-image-loader-container">
                <div className="item-image-spinner"></div>
              </div>
            </div>
          )}
          {cartList.some((cartItem) => cartItem._id === item._id) ||
          (JSON.parse(localStorage.getItem("localCartList")) || []).some(
            (storedCartItem) => storedCartItem._id === item._id
          ) ? (
            <button
              onClick={() => handleDelete(item)}
              className="already-in-cart"
            >
              Remove From Cart
            </button>
          ) : (
            <button
              onClick={() => handleAddToCart(item)}
              className="add-to-cart"
            >
              Add To Cart
            </button>
          )}
        </div>
        <div className="item-details">
          <p className="type">{item.type}</p>
          <p className="price">${item.price}</p>
          <p className="material">
            <span>Material</span>
            <br />
            {item.material}
          </p>
          <div>
            <span>Quantity</span>
            <br />
            <select
              className="quantity-input"
              onChange={(e) =>
                handleQuantityChange(id, parseInt(e.target.value))
              }
              value={
                (Array.isArray(initialItems) &&
                  initialItems.find((item) => item._id == id)?.newquantity) ||
                (Array.isArray(clickedList) &&
                  clickedList.find((item) => item._id == id)?.newquantity)
              }
            >
              {Array.from(
                {
                  length: item.quantity,
                },
                (_, i) => i + 1
              ).map((optionValue) => (
                <option key={optionValue} value={optionValue}>
                  {optionValue}
                </option>
              ))}
            </select>
          </div>
          <p>
            <span>Total Price</span> <br /> $
            {clickedList.find((clickedItem) => clickedItem._id === id)
              ?.newprice ||
              initialItems.find((item) => item._id == id)?.price ||
              item.price}
          </p>
          <p className="description">
            <span>Description</span>
            <br /> {item.description}
          </p>
          <p>
            You want to make a special order?{" "}
            <a href="">Contact our wholesales team</a> or call{" "}
            <a href="tel:+234-8142360551 ">+234-8142360551 </a>
          </p>
          <p>
            <span>Instructions</span>
            <br />
            {item.instructions}
          </p>
        </div>
      </div>
      <div className="related-items">
        <h4>more like this..</h4>
        <div className="related-container">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            spaceBetween={5}
            slidesPerView={4}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            // pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
          >
            {relatedItems?.map((item, index) => (
              <SwiperSlide>
                <div
                  className={`related-product-list ${
                    item.outOfStock ? "out-of-stock" : ""
                  }`}
                  key={item._id}
                >
                  <Link
                    onClick={() => !item.outOfStock && localClickedList(item)}
                    className={`related-product-link ${
                      item.outOfStock ? "disabled-link" : ""
                    }`}
                    to={!item.outOfStock ? `/${item._id}` : "#"}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={item.outOfStock ? "out-of-stock-img" : ""}
                    />
                    <div className="related-product-link-texts">
                      <p>{item.type}</p>
                      <p>
                        $<span>{item.price}</span> per yard
                      </p>
                      <p>
                        <span>{item.quantity}</span> yards left
                      </p>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev-custom">
              <MdOutlineNavigateBefore />
            </div>
            <div className="swiper-button-next-custom">
              <MdOutlineNavigateNext />{" "}
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
