import { ProductContext } from "../productContext";
import { useContext,useEffect,useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios"
import { useLocation } from "react-router-dom";




function SearchResults() {
    const [error, setError] = useState(null); // Track errors
    const [searchResult, setSearchResult] = useState([])
        const { shouldSearch,setShouldSearch, setShouldFetchCart} = useContext(ProductContext);
        const location = useLocation(); // Get the current location object
        const searchTerm = new URLSearchParams(location.search).get('q'); // Extract search term
      
      
      
      useEffect(()=> {
        async function handleSearch (e) {
              try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/search`, {
                  searchTerm,
                });
          
               setSearchResult(response.data.result);
                console.log(response)
                setShouldSearch(false)
            }
            catch (error) {
              console.error('Error:', error.message);
            }
          }

          handleSearch()
      }, [shouldSearch])  

        const handleAddToCart = async (fabric) => {

        const token = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
      
        if (!token) {
          return;
        }
      
        const productId = fabric._id;
        setShouldFetchCart(true); 
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/cart/add`,
            { productId }, 
            { headers }
          );
      
          console.log('Adding fabric to cart:', response.data); // Handle successful response (optional)
        } catch (error) {
          console.error('Error adding to cart:', error);
          setError('An error occurred while adding to cart.'); // Display user-friendly error
        }
      };

    return (
      <div>
        <h1>Search Results </h1>
        <ul>
          {searchResult.map((result) => ( 
              <div key={result._id}>   
               <Link to={`/${result._id}`}>   
                <img src={result.image} alt={result.name} />
                <p>{result.name}</p>
                 </Link>               
                  <button onClick={() => handleAddToCart(result)}>Add to Cart</button>
              </div>         
            ))}
        </ul>
      </div>
    );
  }
  
  export default SearchResults;
  