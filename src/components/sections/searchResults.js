import { ProductContext } from "../productContext";
import { useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import formbg from "../../assets/formbg.webp";
import { Card } from "../cards/sectionCard";

function SearchResults() {
  const { shouldSearch, setShouldSearch } = useContext(ProductContext);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("q");

  const fetchSearchResults = async () => {
    if (!searchTerm) return [];
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/search`,
      { searchTerm }
    );
    console.log(searchTerm, response.data.result);
    return response.data.result;
  };

  const {
    data: searchResult = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchResults", searchTerm],
    queryFn: fetchSearchResults,
    enabled: !!searchTerm,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    onSuccess: () => setShouldSearch(false), 
  });

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
          <p className="error-message">Error: {error.message}</p>
        </div>
      ) : searchResult.length > 0 ? (
        <div>
          <h3 className="search-header">Search Results</h3>
          <div className="product-list-container">
            {searchResult.map((item) => (
              <Card key={item._id} {...item} />
            ))}
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
