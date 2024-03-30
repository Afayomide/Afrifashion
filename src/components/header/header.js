import { useEffect, useState, useContext } from "react";
import "./header.css"
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BsCart } from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { BsGenderMale } from "react-icons/bs";
import { BsGenderFemale } from "react-icons/bs";
import { GiRolledCloth } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";
import { GiAfrica } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { ProductContext } from '../productContext';
import { BsSearch } from "react-icons/bs";


function Header() {
  const navigate = useNavigate();
  const [displayNav, SetDisplayNav] = useState(false)
  const {authenticated, setAuthenticated} = useContext(ProductContext)
  const [slideout, setSlideOut] = useState("")
  const { cartNo, setCartNo, shouldFetchCart, setShouldSearch, setShouldFetchCart,mainLoading, setMainLoading, localCartLength, setLocalCartLength } = useContext(ProductContext);
  const [searchDisplay, setSearchDisplay] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  



  const Token = localStorage.getItem('authToken');


function handleSearchDisplay(e){
  if (!searchDisplay){
      setSearchDisplay(true)
  }
  else {
    setSearchDisplay(false)
  }
}


async function handleSearch (e) {
  e.preventDefault()

      navigate(`/search?q=${searchTerm}`);
      setShouldSearch(true)
}


  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      setAuthenticated(true);
      setShouldFetchCart(true)
      console.log(authToken)
      setInterval(()=>{
        setShouldFetchCart(false)
      }, 10)
    }  else if (!authToken) {
      setAuthenticated(false);
    }
  },[]);

  useEffect(() => {
    const fetchList = async () => {
      const token = localStorage.getItem("authToken")
    if (token && mainLoading) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userCartItems = await response.data.cartItems;
        const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];

    const cartItemsToAdd = storedCartList.filter(item => !userCartItems.some(userItem => userItem._id === item._id));

    await Promise.all(cartItemsToAdd.map(async cartItem => {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        { productId: cartItem._id }, 
        { headers }
      );
      console.log('Added item to user cart:', response.data);
    }
    ));
      }
        catch{

        }
      }
    }
    fetchList()
  }, [Token])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const localCart = JSON.parse(localStorage.getItem("localCartList"))
          const fetchData = async () => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },            
              });
  
              setCartNo(response.data.cartLength);
              console.log("fetched cart length")
              if (!localCart){
                console.log(localCart)
                setLocalCartLength(response.data.cartLength)
              }
          }
            catch (error) {
              if (error.response && error.response.status === 403) {
                console.error('Error (403 Forbidden):', error.message);
                localStorage.removeItem('authToken');
                setAuthenticated(false);
                console.log("Login again (403)"); // Include the status code for clarity
              } 
              else {
                console.error('Other Error:', error);
            }
            if (error.response && error.response.status === 500) {
              setMainLoading(false)
              console.log("empty")
            }
          }
          finally{setShouldFetchCart(false)}
        }
          fetchData()
    
       
        }, [shouldFetchCart]);




   

    function  changeDisplay() {
            setSlideOut("links-slide-out")
             SetDisplayNav(!displayNav)
    }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem("localCartList")
    setShouldFetchCart(true)
    changeDisplay()
    setAuthenticated(false);
      navigate("/")
      setLocalCartLength(0)
  };
    return(
      <div>
     <header>
     {authenticated ? (<div>
      <nav className="big-screen-nav">

<div>
<NavLink   
className="h1-link" 
to="/">
   <h1>
       Cool Styles<GiAfrica className="africalogo"/>
</h1>
</NavLink>

</div>

<div className="header-links">
<NavLink 
className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  
to="/femalestyles">
<BsGenderFemale/><p>Female Styles</p> 
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/malestyles" >
<BsGenderMale/><p>Male Styles</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/fabrics">
<GiRolledCloth/><p>Fabrics</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/contact">
<BsFillTelephoneInboundFill/><p>Contact Us </p>
</NavLink>
</div>

<div className="log-sign">
  <p onClick={handleSearchDisplay} className="big-screen-search-button"><sup><BsSearch/></sup>search</p>

<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{localCartLength}</sup>
</NavLink>


<p className= "big-screen-link logout-button" onClick={handleLogout}>Logout</p>
</div>
</nav>




<nav className="small-screen-nav">

<div className="h1-menu">
{displayNav ?<MdCancel className="menu" onClick={changeDisplay}/> : <CiMenuFries className="menu" onClick={changeDisplay}/> }

<NavLink className="h1-link" to="/">
<h1>
Cool Styles<GiAfrica className="africalogo"/>
</h1>

</NavLink>

</div>

<div className="cart-search">
<p onClick={handleSearchDisplay} className="small-screen-search-button"><BsSearch/></p>

<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{localCartLength}</sup>
</NavLink>
</div>
</nav>

<div className={`small-nav-links ${displayNav ? "show-nav" : 'hide-nav'}`}>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/femalestyles" ><BsGenderFemale/><p>Female Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/malestyles"><BsGenderMale/><p>Male Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/fabrics"><GiRolledCloth/><p>Fabrics</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/contact"><p>Contact US</p></NavLink>
<button className="nav-link logout-button"  onClick={handleLogout}>Logout</button>

</div>
{searchDisplay ? <form className={`search-input-container ${searchDisplay ? "show-search-input": "hide-search-input"}`} onSubmit={handleSearch}><input className="search-input" type="search" placeholder="enter keyword" onChange={(e) => {
            setSearchTerm(e.target.value)}} /></form> : ""}
     </div>
     
     )
     
      : 
     
     (<div>
      <nav className="big-screen-nav">

<div>
<NavLink   
className="h1-link" 
to="/">
   <h1>
       Cool Styles<GiAfrica className="africalogo"/>
</h1>
</NavLink>

</div>

<div className="header-links">
<NavLink 
className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  
to="/femalestyles">
<BsGenderFemale/><p>Female Styles</p> 
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/malestyles" >
<BsGenderMale/><p>Male Styles</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/fabrics">
<GiRolledCloth/><p>Fabrics</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/contact">
<BsFillTelephoneInboundFill/><p>Contact Us </p>
</NavLink>
</div>

<div className="log-sign">
<p onClick={handleSearchDisplay} className="big-screen-search-button">search<sup><BsSearch/></sup></p>
<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{localCartLength}</sup>
</NavLink>
{/*  */}
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/signup" >Signup</NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/login" >Login</NavLink>
</div>
</nav>




<nav className="small-screen-nav">

<div className="h1-menu">
{displayNav ?<MdCancel className="menu" onClick={changeDisplay}/> : <CiMenuFries className="menu" onClick={changeDisplay}/> }

<NavLink className="h1-link" to="/">
<h1>
Cool Styles<GiAfrica className="africalogo"/>
</h1>

</NavLink>

</div>

<div className="cart-search">
<p onClick={handleSearchDisplay} className="small-screen-search-button"><BsSearch/></p>

<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{localCartLength}</sup>
</NavLink>
</div>

</nav>

<div className={`small-nav-links ${displayNav ? "show-nav" : 'hide-nav'}`}>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/femalestyles" ><BsGenderFemale/><p>Female Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/malestyles"><BsGenderMale/><p>Male Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/fabrics"><GiRolledCloth/><p>Fabrics</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/contact"><p>Contact US</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/login"><p>Login</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/signup"><p>Signup</p></NavLink>
</div>
  {searchDisplay ? <form className={` search-input-container ${searchDisplay ? "show-search-input": "hide-search-input"}`} onSubmit={handleSearch}><input className="search-input" type="search" placeholder="enter keyword" onChange={(e) => {
            setSearchTerm(e.target.value)}} /></form> : ""}
     </div>)}
    
     </header>
   
            </div>
    )
}
export default Header