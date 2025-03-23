import { useEffect } from "react";
import useFabricStore from "./useHomeStore"; // Import the Zustand store
import { Link } from "react-router-dom";
import Card from "../cards/homeCard";
import "./home.css";
import logo from "../../assets/logo.png";
import hero from "../../assets/hero.png";

const Home = () => {
  const { lace, asoOke, dansiki, ankara, gele, isLoading, fetchData } =
    useFabricStore();

 useEffect(() => {
   fetchData();
   const interval = setInterval(fetchData, 30000); // Refresh every 30s
   return () => clearInterval(interval);
 }, [fetchData]);


  return (
    <div className="home-container">
      <h3 className="welcome">
        Welcome To AfroRoyals <img src={logo} className="logo" />
      </h3>
      <div className="hero-image">
        <img src={hero} />
      </div>
      <div className="home-links">
        <Link to="/fabrics" className="home-link">
          View All Fabrics
        </Link>
        <div>
          {[
            { title: "Ankara", data: ankara, query: "ankara" },
            { title: "Aso Oke (Top Cloth)", data: asoOke, query: "aso-oke" },
            { title: "Dansiki", data: dansiki, query: "dansiki" },
            { title: "Lace", data: lace, query: "lace" },
          ].map(({ title, data, query }) => (
            <div className="home-fabric-section" key={query}>
              <h3>
                <Link className="home-section-link" to={`/search?q=${query}`}>
                  {title}
                </Link>
              </h3>
              {!isLoading ? (
                <div className="home-product-list-container">
                  {data.map((item, index) => (
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
};

export default Home;
