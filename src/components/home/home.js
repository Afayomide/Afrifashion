import { useEffect, useState, useContext, useRef } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./home.css"
import asooke from "../../assets/asooke.jpg"
import { ProductContext } from "../productContext"
import logo from "../../assets/logo.png"






function Home () {
  const navigate = useNavigate()
    const [lace, setLace ] = useState([])
    const [asoOke, setAsoOke] = useState([])
    const {authenticated, cartNo, setCartNo, setShouldFetchCart,mainLoading, setMainLoading, setLocalCartLength, cartList, setCartList } = useContext(ProductContext);
    const [error, setError] = useState(null); 
    const [dansiki, setDansiki] = useState([])
    const [ankara, setAnkara] = useState([])
    const [gele, setGele] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [slideInItems, setSlideInItems] = useState(new Set()); // Track items that have slid in
    const itemRefs = useRef([]); // Store refs for each item
  
  


    const handleAddToCart = async (fabric) => {
        const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
          const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
          storedCartList.push(fabricWithQuantity);
          localStorage.setItem('localCartList', JSON.stringify(storedCartList));
      
          setLocalCartLength(storedCartList.length);
          setCartNo(storedCartList.length)
      
          if (authenticated){
        try {         

          if (!authenticated) {
            throw new Error("User not authenticated");
          }
      
          const productId = fabric._id;
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/cart/add`,
            { productId }, 
          );
      
        } catch (error) {
          setError('An error occurred while adding to cart.');
      
          const updatedCartList = storedCartList.filter(item => item._id !== fabric._id);
          localStorage.setItem('localCartList', JSON.stringify(updatedCartList));
        } finally {
          setShouldFetchCart(true); 
        }
      }
      };



      useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setSlideInItems(prev => new Set(prev).add(entry.target)); // Add item to set
              observer.unobserve(entry.target); // Stop observing once item is visible
            }
          });
        });
    
        // Observe each item
        itemRefs.current.forEach(item => {
          if (item) observer.observe(item);
        });
    
        return () => {
          observer.disconnect(); // Cleanup observer on unmount
        };
      }, []);
    

    useEffect(() => {
        const token = localStorage.getItem("authToken")
        const fetchData = async () => {
          try { 
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clothespreview`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },            
            });
        const fiveItems = response.data.previewData
          setAsoOke(fiveItems.asoOke)
          setLace(fiveItems.lace)
          setDansiki(fiveItems.dansiki)
          setGele(fiveItems.gele)
          setAnkara(fiveItems.ankara)
    }
    catch{}
    finally{
      setIsLoading(false)
    }
}
fetchData()
}, [])

function localClickedList(fabric) {
  const clickedList = JSON.parse(localStorage.getItem('localClickedList')) || [];
  const clickedItemId = clickedList.find(item => item._id === fabric._id); // Assuming 'id' is unique for each fabric
  if (clickedItemId) {
  } else {
      const clickedItem = { ...fabric, newquantity: 1 }; 
      clickedList.push(clickedItem);
  
  }
  localStorage.setItem('localClickedList', JSON.stringify(clickedList));
}



    
  function Card(props) {
    return (
      <div 
        ref={el => itemRefs.current[props.index] = el} 
        className={`home-product-list ${props.outOfStock ? 'out-of-stock' : ''} ${slideInItems.has(props.index) ? 'slide-in' : ''}`} 
        key={props._id}
      >
        <Link
          onClick={() => !props.outOfStock && localClickedList(props)}
          className={`home-product-link ${props.outOfStock ? 'disabled-link' : ''}`}
          to={!props.outOfStock ? `/${props._id}` : '#'}
        >
          <img src={props.image} alt={props.name} className={props.outOfStock ? 'out-of-stock-img' : ''} />
          <div className="home-product-link-texts">
            <p>{props.type}</p>
            <p>$<span>{props.price}</span> per yard</p>
            <p><span>{props.quantity}</span> yards left</p>
          </div>
        </Link>

        {(JSON.parse(localStorage.getItem('localCartList')) || []).some((storedCartItem) => storedCartItem._id === props._id) ? (
          <Link to={`/${props._id}`}>
            <button onClick={() => navigate(`/${props._id}`)} className="home-cart-button already-in-cart">
              Added To Cart
            </button>
          </Link>
        ) : !props.outOfStock ? (
          <button className="home-cart-button add-to-cart" onClick={() => handleAddToCart(props)}>
            Add to Cart
          </button>
        ) : (
          <button className="home-cart-button out-of-stock-button">
            Out Of Stock
          </button>
        )}
      </div>
    );
  }
    return(
        <div className="home-container">
        <h3 className="welcome">Welcome To AfroRoyals <img src={logo} className="logo"/></h3>
        <div className="home-links">
              
       <Link to="/fabrics" className="home-link">View All Fabrics</Link> 
        <div>     


        <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso-oke">Ankara</Link></h3>
                {
              !isLoading ?(<div className="home-product-list-container">
                  {ankara.map((item, index) => <Card key={item._id} {...item} index={index} />)}  
                </div> ) : (        
                  <div className="home-product-list-container">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
          </div>)
                }
                <p><Link to='search?q=ankara' className="home-see-all-link">{!isLoading ? <span>see all</span> : <span>fetching</span>} Ankara.....</Link></p>
            </div>     


            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso-oke">Aso Oke(Top Cloth)</Link></h3>
                {
              !isLoading ?(<div className="home-product-list-container">
                  {asoOke.map((item, index) => <Card key={item._id} {...item} index={index} />)}  
                </div> ) : (        
                  <div className="home-product-list-container">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
          </div>)
                }
                <p><Link to='search?q=aso-oke' className="home-see-all-link">{!isLoading ? <span>see all</span> : <span>fetching</span>} Aso Oke.....</Link></p>
            </div>


            <div className="home-fabric-section">
                <h3><Link  className="home-section-link" to="/search?q=aso-oke">Dansiki</Link></h3>  
                {
                !isLoading ?(<div className="home-product-list-container">
                  {dansiki.map((item, index) => <Card key={item._id} {...item} index={index} />)}  
                </div> ) : (        
                  <div className="home-product-list-container">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
          </div>)
                }
                <p><Link to='search?q=dansiki' className="home-see-all-link">{!isLoading ? <span>see all</span> : <span>fetching</span>} dansiki.....</Link></p>    
            </div>


            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso-oke">Gele</Link></h3>
                {
          !isLoading ?(<div className="home-product-list-container">
                  {gele.map((item, index) => <Card key={item._id} {...item} index={index} />)}  
                </div> ) : (        
                  <div className="home-product-list-container">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
          </div>)
                }
                <p><Link to='search?q=gele' className="home-see-all-link">{!isLoading ? <span>see all</span> : <span>fetching</span>} gele.....</Link></p>    
            </div>


            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=lace">Lace</Link></h3>
                {
          !isLoading ?(<div className="home-product-list-container">
                  {lace.map((item, index) => <Card key={item._id} {...item} index={index} />)}  
                </div> ) : (        
                  <div className="home-product-list-container">
          <div className="loader-container">
          <div className="spinner"></div>
      </div>
          </div>)
                }
                <p><Link to='search?q=lace' className="home-see-all-link">{!isLoading ? <span>see all</span> : <span>fetching</span>} lace.....</Link></p>    
            </div>

        </div>
        </div>
        </div>
    )
}

export default Home