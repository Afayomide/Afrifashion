import { ProductContext } from "../productContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import formbg from "../../assets/formbg.webp";
import { Card } from "../cards/sectionCard";

function SearchResults() {
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const { shouldSearch, setShouldSearch, setShouldFetchCart } =
    useContext(ProductContext);
  const location = useLocation(); 
  const searchTerm = new URLSearchParams(location.search).get("q");
 

  useEffect(() => {
    async function handleSearch(e) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/search`,
          {
            searchTerm,
          }
        );

        setSearchResult(response.data.result);
        console.log(response);
        setShouldSearch(false);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    handleSearch();
  }, [shouldSearch]);

  return (
    <div className="product-list-container">
      {isLoading ? (
        <div className="message">
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
          <p className="loading-message">....searching</p>
        </div>
      ) : error ? (
        <div className="message">
          <img src={formbg} alt="login background" className="auth-bg-image" />
          <img className="error-image" src={formbg} />
          <p className="error-message">Error: {error}</p>
        </div>
      ) : searchResult.length > 0 ? (
        <div>
          <h3 className="search-header">Search Results</h3>
          <div className="product-list-container">
            {searchResult.map((result, index) => {
              return <Card {...result} />;
            })}
          </div>
        </div>
      ) : (
        <div className="message">
          <p className="loading-message">We found nothing</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
