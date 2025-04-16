import { memo, useEffect,useState } from "react";
import useFabricStore from"../stores/useHomeStore"; // Import the Zustand store
import { Link } from "react-router-dom";
import Card from "../cards/homeCard";
import "./home.scss";
import logo from "../../assets/logo.webp";
import hero from "../../assets/hero.png";
import { title } from "../globalPhrases";
import { useCurrency } from "../currency/currencyContext";
import logo2 from "../../assets/logo2.webp";
import { ChevronRight } from "lucide-react";

const Home = memo(() => {
  const {exchangeRate} = useCurrency();
  const { lace, asoOke, dansiki, ankara, gele, isLoading, fetchData } =
    useFabricStore();
    
useEffect(() => {
  if (exchangeRate) {
    fetchData(exchangeRate); 
  }
}, [exchangeRate]);


  return (
    <div className="home-container">
      <h3 className="welcome">
        Welcome To {title} <img src={logo} className="logo" />
      </h3>

      <div className="hero-section">
        <div className="hero-image">
          <img src={logo2} alt="Hero" />
          <div className="hero-overlay">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">
              Premium quality fabrics for your unique style
            </p>
            <Link to="https://wa.link/xk588j" className="hero-cta">
              Special Order? <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="hero-image">
        <img src={hero} />
      </div> */}
      <div className="home-links">
        <div className="home-top-section-links">
          <Link to="/fabrics" className="home-link">
            All Fabrics
          </Link>
          <Link to="/search?q=ankara" className="home-link">
            Ankara
          </Link>
          <Link to="/search?q=dansiki" className="home-link">
            Dansiki
          </Link>
          <Link to="/search?q=lace" className="home-link">
            lace
          </Link>
        </div>
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
});

export default Home;
