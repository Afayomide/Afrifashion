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
import { CartContext } from '../cartContext';
import { BsSearch } from "react-icons/bs";


function Header() {
  const navigate = useNavigate();
  const [displayNav, SetDisplayNav] = useState(false)
  const[authenticated, setAuthenticated] = useState()
  const [slideout, setSlideOut] = useState("")
  const [cartNo, setCartNo] = useState()
  const { shouldFetchCart,setShouldFetchCart } = useContext(CartContext);
  const [searchDisplay, setSearchDisplay] = useState(false)


  const Token = localStorage.getItem('authToken');


function handleSearchDisplay(){
  if (!searchDisplay){
      setSearchDisplay(true)
  }
  else {
    setSearchDisplay(false)
  }
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
  });


  useEffect(() => {
    const token = localStorage.getItem("authToken")
          const fetchData = async () => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },            
              });
  
              setCartNo(response.data.cartLength);
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
          };
        }
          fetchData()
    
          if (shouldFetchCart) {
          fetchData(); 
          setShouldFetchCart(false);
          }
        });




   

    function  changeDisplay() {
            setSlideOut("links-slide-out")
             SetDisplayNav(!displayNav)
    }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    changeDisplay()
    setAuthenticated(false);
      navigate("/")
  };
    return(
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
<BsCart /><sup>{Token ?`${cartNo}` : 0}</sup>
</NavLink>


<p className= "big-screen-link logout-button" onClick={handleLogout}>Logout</p>
</div>
</nav>
{searchDisplay ? <input type="search" /> : ""}



<nav className="small-screen-nav">

<div className="h1-menu">
{displayNav ?<MdCancel className="menu" onClick={changeDisplay}/> : <CiMenuFries className="menu" onClick={changeDisplay}/> }

<NavLink className="h1-link" to="/">
<h1>
Cool Styles<GiAfrica className="africalogo"/>
</h1>

</NavLink>

</div>


<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{Token ?`${cartNo}` : 0}</sup>
</NavLink>
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
     </div>)
     
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
<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{Token ?`${cartNo}` : 0}</sup>
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


<NavLink className="cart-link" to="/cart">
<BsCart /><sup>{Token ?`${cartNo}` : 0}</sup>
</NavLink>
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
     </div>)}
    
     </header>
    )
}
export default Header