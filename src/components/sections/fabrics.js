import { useEffect, useState, memo } from "react";
import axios from "axios";
import { useContext } from "react";
import { ProductContext } from "../productContext";
import "./sections.css";
import formbg from "../../assets/formbg.webp";
import { Card } from "../cards/sectionCard";

const Fabrics = memo(() => {
  const [fabricsList, setFabricsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mainLoading, setMainLoading, setCartList } =
    useContext(ProductContext);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/fabrics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFabricsList(response.data.fabrics);

        if (response.data.fabrics && token) {
          try {
            const cartResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/cart/list`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setCartList(cartResponse.data.cartItems);
          } catch (error) {
            console.error("Error fetching cart data:", error);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setMainLoading(false);
          console.log("empty");
        }
        console.error("Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    if (mainLoading == true) {
      fetchData();
    } else {
      setIsLoading(false);
      console.log("something is wrong");
      setError("something is wrong");
    }
  }, []);

  return (
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
          <img className="error-image" src={formbg} alt="error background" />
          <p className="error-message">Error: {error}</p>
        </div>
      ) : fabricsList.length > 0 ? (
        <div className="product-list-container">
          {fabricsList.map((item) => {
            return <Card {...item} />;
          })}
        </div>
      ) : (
        <div className="message">
          <p className="loading-message">No fabric found</p>
        </div>
      )}
    </div>
  );
});

export default Fabrics;
