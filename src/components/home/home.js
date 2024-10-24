import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import asooke from "../../assets/asooke.jpg";
import logo from "../../assets/logo.png";
import Card from "../cards/homeCard";

function Home() {
  const [lace, setLace] = useState([]);
  const [asoOke, setAsoOke] = useState([]);
  const [dansiki, setDansiki] = useState([]);
  const [ankara, setAnkara] = useState([]);
  const [gele, setGele] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slideInItems, setSlideInItems] = useState(new Set()); // Track items that have slid in
  const itemRefs = useRef([]); // Store refs for each item



 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/clothespreview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fiveItems = response.data.previewData;
        setAsoOke(fiveItems.asoOke);
        setLace(fiveItems.lace);
        setDansiki(fiveItems.dansiki);
        setGele(fiveItems.gele);
        setAnkara(fiveItems.ankara);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

 


  return (
    <div className="home-container">
      <h3 className="welcome">
        Welcome To AfroRoyals <img src={logo} className="logo" />
      </h3>
      <div className="home-links">
        <Link to="/fabrics" className="home-link">
          View All Fabrics
        </Link>
        <div>
          <div className="home-fabric-section">
            <h3>
              <Link className="home-section-link" to="/search?q=aso-oke">
                Ankara
              </Link>
            </h3>
            {!isLoading ? (
              <div className="home-product-list-container">
                {ankara.map((item, index) => (
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
            <p>
              <Link to="search?q=ankara" className="home-see-all-link">
                {!isLoading ? <span>see all</span> : <span>fetching</span>}{" "}
                Ankara.....
              </Link>
            </p>
          </div>

          <div className="home-fabric-section">
            <h3>
              <Link className="home-section-link" to="/search?q=aso-oke">
                Aso Oke(Top Cloth)
              </Link>
            </h3>
            {!isLoading ? (
              <div className="home-product-list-container">
                {asoOke.map((item, index) => (
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
            <p>
              <Link to="search?q=aso-oke" className="home-see-all-link">
                {!isLoading ? <span>see all</span> : <span>fetching</span>} Aso
                Oke.....
              </Link>
            </p>
          </div>

          <div className="home-fabric-section">
            <h3>
              <Link className="home-section-link" to="/search?q=aso-oke">
                Dansiki
              </Link>
            </h3>
            {!isLoading ? (
              <div className="home-product-list-container">
                {dansiki.map((item, index) => (
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
            <p>
              <Link to="search?q=dansiki" className="home-see-all-link">
                {!isLoading ? <span>see all</span> : <span>fetching</span>}{" "}
                dansiki.....
              </Link>
            </p>
          </div>

          <div className="home-fabric-section">
            <h3>
              <Link className="home-section-link" to="/search?q=aso-oke">
                Gele
              </Link>
            </h3>
            {!isLoading ? (
              <div className="home-product-list-container">
                {gele.map((item, index) => (
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
            <p>
              <Link to="search?q=gele" className="home-see-all-link">
                {!isLoading ? <span>see all</span> : <span>fetching</span>}{" "}
                gele.....
              </Link>
            </p>
          </div>

          <div className="home-fabric-section">
            <h3>
              <Link className="home-section-link" to="/search?q=lace">
                Lace
              </Link>
            </h3>
            {!isLoading ? (
              <div className="home-product-list-container">
                {lace.map((item, index) => (
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
            <p>
              <Link to="search?q=lace" className="home-see-all-link">
                {!isLoading ? <span>see all</span> : <span>fetching</span>}{" "}
                lace.....
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
