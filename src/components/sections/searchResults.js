import { ProductContext } from "../productContext";
import { useContext,useEffect,useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios"
import { useLocation } from "react-router-dom";
import formbg from "../../assets/formbg.webp"
import bgImage from "../../assets/fabricsbg.jpeg"





function SearchResults() {
    const [error, setError] = useState(null); // Track errors
    const [isLoading, setIsLoading] = useState(true); 
    const [searchResult, setSearchResult] = useState([])
        const { shouldSearch,setShouldSearch, setShouldFetchCart} = useContext(ProductContext);
        const location = useLocation(); // Get the current location object
        const searchTerm = new URLSearchParams(location.search).get('q'); // Extract search term
        const { cartNo, setCartNo,mainLoading, setMainLoading, setLocalCartLength, cartList, setCartList } = useContext(ProductContext);

      
      
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
            finally{
              setIsLoading(false)
            }
          }

          handleSearch()
      }, [shouldSearch])  

      const handleAddToCart = async (fabric) => {
        const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
          const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
          storedCartList.push(fabricWithQuantity);
          localStorage.setItem('localCartList', JSON.stringify(storedCartList));
          console.log('Added fabric to local cart:', fabric);
      
          setLocalCartLength(storedCartList.length);
          setCartNo(storedCartList.length)
      
          const token = localStorage.getItem("authToken");
      
          if (token){
        try {
       
      
          const token = localStorage.getItem("authToken");
          if (token) {}
          const headers = {
            Authorization: `Bearer ${token}`,
          };
      
          if (!token) {
            throw new Error("User not authenticated");
          }
      
          const productId = fabric._id;
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/cart/add`,
            { productId }, 
            { headers }
          );
      
          console.log('Added fabric to server cart:', response.data);
        } catch (error) {
          console.error('Error adding to cart:', error);
          setError('An error occurred while adding to cart.');
      
          const updatedCartList = storedCartList.filter(item => item._id !== fabric._id);
          localStorage.setItem('localCartList', JSON.stringify(updatedCartList));
          console.log('Removed fabric from local cart:', fabric);
        } finally {
          setShouldFetchCart(true); 
        }
      }
      };
      

    return (
      <div className="product-list-container">
                          {/* <img className="fabrics-bg-image" src={bgImage} alt="backgroundImage"/> */}
      {isLoading ? (
        <div className="message">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
                    <p className="loading-message">....searching</p>
          </div>
      ) : error ? (
        <div className="message">
        <img src={formbg} alt='login background' className='auth-bg-image'/>

        <img className="error-image" src={formbg}/>
        <p className="error-message">Error: {error}</p>
        </div>
      ) : (
        searchResult.length > 0 ? ( 
          <div>
            <h3 className="search-header">Search Results</h3>
     <div className="product-list-container">
            {searchResult.map((result, index) => ( 
              <div className="product-list" key={result._id}>   
               <Link className="product-link" to={`/${result._id}`}>   
                <img src={result.image} alt={result.name} />
                <div className="product-link-texts">
                  <p><span>type:</span>{result.type}</p>  
                   <p>{result.description}</p>
                   <p><span>Qty:</span>{result.quantity} yards</p>
                   <p><span>Price:</span>{result.price} per yard</p>
                </div>
                 </Link>      
        
                 {cartList.some((cartItem) => cartItem._id === result._id) || (JSON.parse(localStorage.getItem('localCartList')) || []).some((storedCartItem) => storedCartItem._id === result._id) ? (
    <button className="cart-button already-in-cart">Added To Cart</button>
) : (
    <button className="cart-button add-to-cart" onClick={() => handleAddToCart(result)}>Add to Cart</button>
)}</div>         
            ))} 
            </div>   
            </div>
        ) : (
          <div className="message">
                    <p className="loading-message">we found nothing</p>
          </div>
        )
      )}
        </div>
    );
  }
  
  export default SearchResults;
 