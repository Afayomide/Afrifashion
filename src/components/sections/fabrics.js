import { memo, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductContext } from "../productContext";
import "./sections.css";
import formbg from "../../assets/formbg.webp";
import { Card } from "../cards/sectionCard";

const fetchFabrics = async () => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/fabrics`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.fabrics;
};

const fetchCart = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return [];
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/cart/list`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data.cartItems;
};

const Fabrics = memo(() => {
  const { setCartList } = useContext(ProductContext);

  const {
    data: fabricsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fabrics"],
    queryFn: fetchFabrics,
    staleTime: 1000 * 60 * 5, // Keep data for 5 minutes
    refetchOnMount: false,
    keepPreviousData: true, // Use old data while fetching new data
  });

  useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    onSuccess: (cartItems) => setCartList(cartItems),
  });

  const renderedCards = useMemo(() => {
    return fabricsList?.map((item) => <Card key={item._id} {...item} />);
  }, [fabricsList]);

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
          <p className="error-message">Error: {error.message}</p>
        </div>
      ) : fabricsList?.length > 0 ? (
        <div className="product-list-container">{renderedCards}</div>
      ) : (
        <div className="message">
          <p className="loading-message">No fabric found</p>
        </div>
      )}
    </div>
  );
});

export default Fabrics;
