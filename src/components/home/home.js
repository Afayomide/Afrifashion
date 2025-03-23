import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./home.css";
import logo from "../../assets/logo.png";
import Card from "../cards/homeCard";
import hero from "../../assets/hero.png";
import React, { memo } from "react";

const fetchClothesPreview = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/clothespreview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.previewData;
};

const Home = memo(function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["clothesPreview"],
    queryFn: fetchClothesPreview,
  });

  const memoizedData = useMemo(() => data || {}, [data]);

  return (
    <div className="home-container">
      <h3 className="welcome">
        Welcome To AfroRoyals <img src={logo} className="logo" />
      </h3>
      <div className="hero-image">
        <img src={hero} alt="Hero" />
      </div>
      <div className="home-links">
        <Link to="/fabrics" className="home-link">
          View All Fabrics
        </Link>
        <div>
          {["ankara", "asoOke", "dansiki", "lace"].map((category) => (
            <div key={category} className="home-fabric-section">
              <h3>
                <Link
                  className="home-section-link"
                  to={`/search?q=${category}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              </h3>
              {!isLoading ? (
                <div className="home-product-list-container">
                  {memoizedData[category]?.map((item, index) => (
                    <Card key={item._id} {...item} index={index} />
                  ))}
                </div>
              ) : (
                <div className="home-product-list-container">
                  <div className="loader-container">
                    <div className="spinner"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Home;
