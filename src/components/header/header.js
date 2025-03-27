import { useEffect, useState, useContext } from "react";
import "./header.css";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BsCart } from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { toast } from "react-hot-toast";
import { GiRolledCloth } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { GiAfrica } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../productContext";
import { BsSearch } from "react-icons/bs";
import { GiCrown } from "react-icons/gi";
import { GrCircleQuestion } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import { title } from "../globalPhrases";
const token = localStorage.getItem("token")
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState({});
  const [displayNav, SetDisplayNav] = useState(false);
  const { authenticated, setAuthenticated } = useContext(ProductContext);
  const [slideout, setSlideOut] = useState("");
  const {
    cartNo,
    setCartNo,
    shouldFetchCart,
    setCartList,
    setShouldSearch,
    setShouldFetchCart,
    mainLoading,
    setMainLoading,
    localCartLength,
    setLocalCartLength,
    setInitialItems,
    initialItems,
  } = useContext(ProductContext);
  const [searchDisplay, setSearchDisplay] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  function arraysHaveSameItemsById(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = arr1.slice().sort((a, b) => a.id - b.id);
    const sortedArr2 = arr2.slice().sort((a, b) => a.id - b.id);

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i].id !== sortedArr2[i].id) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    const call = async () => {
      try {
        const localUserLocation = JSON.parse(
          localStorage.getItem("localUserLocation")
        );

        if (
          !localUserLocation ||
          (localUserLocation && Object.keys(localUserLocation).length === 0)
        ) {
          const response = await fetch("https://geolocation-db.com/json/");
          const data = await response.json();

          setUserLocation({
            ipaddress: data.IPv4,
            country: data.country_name,
          });

          localStorage.setItem(
            "localUserLocation",
            JSON.stringify({
              ipaddress: data.IPv4,
              country: data.country_name,
            })
          );

          await axios.post(`${apiUrl}/api/visitor`, {
            route: location.pathname,
            userLocation: {
              ipaddress: data.IPv4,
              country: data.country_name,
            },
          });
        } else {
          setUserLocation(localUserLocation);

          await axios.post(`${apiUrl}/api/visitor`, {
            route: location.pathname,
            userLocation: {
              ipaddress: localUserLocation.ipaddress,
              country: localUserLocation.country,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    call();
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${apiUrl}/api/auth/customer/checkAuth`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Correct way to send token
            },
          }
        );

        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, [setAuthenticated, authenticated]);

  function handleSearchDisplay(e) {
    if (!searchDisplay) {
      setSearchDisplay(true);
    } else {
      setSearchDisplay(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    navigate(`/search?q=${searchTerm}`);
    setShouldSearch(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (authenticated && mainLoading) {
        // const headers = {
        //   Authorization: `Bearer ${Token}`,
        // };

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/cart/list`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`, // Correct way to send token
              },
            }
          );
          const userCartItems = await response.data.cartItems;
          setCartList(response.data.cartItems);

          const storedCartList =
            JSON.parse(localStorage.getItem("localCartList")) || [];

          if (
            storedCartList &&
            arraysHaveSameItemsById(storedCartList, userCartItems)
          ) {
            setInitialItems(storedCartList);
          } else {
            const initialItemsWithQuantity = response.data.cartItems.map(
              (item) => ({
                ...item,
                newquantity: 1,
              })
            );
            setInitialItems(initialItemsWithQuantity);
            localStorage.setItem(
              "localCartList",
              JSON.stringify(initialItemsWithQuantity)
            );
          }
        } catch (error) {
          if (error.response && error.response.status === 500) {
            setMainLoading(false);
          }
          setError(error.message || "An error occurred.");
        }
      }
    };

    fetchData();
  }, [shouldFetchCart, mainLoading, authenticated]);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("localCartList"));
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cart`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Correct way to send token
            },
          }
        );

        setCartNo(response.data.cartLength);
        setLocalCartLength(response.data.cartLength);

        localStorage.setItem("fullname", response.data.fullName);
        localStorage.setItem("email", response.data.email);
        if (!localCart) {
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem("authToken");
          setAuthenticated(false);
        }

        if (error.response && error.response.status === 500) {
          setMainLoading(false);
        }
      } finally {
        setShouldFetchCart(false);
      }
    };
    fetchData();
  }, [shouldFetchCart, authenticated]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("localCartList"))) {
      setLocalCartLength(
        JSON.parse(localStorage.getItem("localCartList")).length
      );
    }
  });

  function changeDisplay() {
    setSlideOut("links-slide-out");
    SetDisplayNav(!displayNav);
  }

  const handleLogout = async () => {
    toast
      .promise(axios.post(`${apiUrl}/api/auth/customer/logout`), {
        loading: "Logging out...",
        success: "Bye for now!",
        error: "Error while logging out",
      })
      .then((response) => {
        const { success } = response.data;
        if (success) {
          ["authToken","token", "localCartList", "fullname", "email"].forEach((item) =>
            localStorage.removeItem(item)
          );
          changeDisplay();
          setAuthenticated(false);
          navigate("/");
          setLocalCartLength(0);
          window.location.reload();
        }
      });
  };
  return (
    <div>
      <header>
        {authenticated ? (
          <div>
            <nav className="big-screen-nav">
              <div>
                <NavLink className="h1-link" to="/">
                  <h1>
                    {title}
                    <GiAfrica className="africalogo" />
                    <sup>
                      <GiCrown className="crown" />
                    </sup>
                  </h1>
                </NavLink>
              </div>

              <div className="header-links">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/fabrics"
                >
                  <GiRolledCloth />
                  <p>Fabrics</p>
                </NavLink>

                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/faqs"
                >
                  <GrCircleQuestion />
                  <p>FAQs</p>
                </NavLink>

                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/contact"
                >
                  <BsFillTelephoneInboundFill />
                  <p>Contact Us </p>
                </NavLink>
              </div>

              <div className="log-sign">
                <p
                  onClick={handleSearchDisplay}
                  className="big-screen-search-button"
                >
                  <sup>
                    <BsSearch />
                  </sup>
                  search
                </p>

                <NavLink className="cart-link" to="/cart">
                  <BsCart />
                  <sup>{localCartLength}</sup>
                </NavLink>

                <p
                  className="big-screen-link logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </nav>

            <nav className="small-screen-nav">
              <div className="h1-menu">
                {displayNav ? (
                  <MdCancel className="menu" onClick={changeDisplay} />
                ) : (
                  <CiMenuFries className="menu" onClick={changeDisplay} />
                )}

                <NavLink className="h1-link" to="/">
                  <h1>
                    {title}
                    <GiAfrica className="africalogo" />
                    <sup>
                      <GiCrown className="crown" />
                    </sup>
                  </h1>
                </NavLink>
              </div>

              <div className="cart-search">
                <p
                  onClick={handleSearchDisplay}
                  className="small-screen-search-button"
                >
                  <BsSearch />
                </p>

                <NavLink className="cart-link" to="/cart">
                  <BsCart />
                  <sup>{localCartLength}</sup>
                </NavLink>
              </div>
            </nav>

            <div
              className={`small-nav-links ${
                displayNav ? "show-nav" : "hide-nav"
              }`}
            >
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/fabrics"
              >
                <GiRolledCloth />
                <p>Fabrics</p>
              </NavLink>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/faqs"
              >
                <GrCircleQuestion />
                <p>FAQs</p>
              </NavLink>

              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/contact"
              >
                <p>Contact US</p>
              </NavLink>
              <button className="nav-link logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
            {searchDisplay ? (
              <form
                className={`search-input-container ${
                  searchDisplay ? "show-search-input" : "hide-search-input"
                }`}
                onSubmit={handleSearch}
              >
                <input
                  className="search-input"
                  type="search"
                  placeholder="enter keyword"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </form>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            <nav className="big-screen-nav">
              <div>
                <NavLink className="h1-link" to="/">
                  <h1>
                    {title}
                    <GiAfrica className="africalogo" />
                    <sup>
                      <GiCrown className="crown" />
                    </sup>
                  </h1>
                </NavLink>
              </div>

              <div className="header-links">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/fabrics"
                >
                  <GiRolledCloth />
                  <p>Fabrics</p>
                </NavLink>

                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/faqs"
                >
                  <GrCircleQuestion />
                  <p>FAQs</p>
                </NavLink>

                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/contact"
                >
                  <BsFillTelephoneInboundFill />
                  <p>Contact Us </p>
                </NavLink>
              </div>

              <div className="log-sign">
                <p
                  onClick={handleSearchDisplay}
                  className="big-screen-search-button"
                >
                  search
                  <sup>
                    <BsSearch />
                  </sup>
                </p>
                <NavLink className="cart-link" to="/cart">
                  <BsCart />
                  <sup>{localCartLength}</sup>
                </NavLink>
                {/*  */}
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/signup"
                >
                  Signup
                </NavLink>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "picked big-screen-link" : "big-screen-link"
                  }
                  to="/login"
                >
                  Login
                </NavLink>
              </div>
            </nav>

            <nav className="small-screen-nav">
              <div className="h1-menu">
                {displayNav ? (
                  <MdCancel className="menu" onClick={changeDisplay} />
                ) : (
                  <CiMenuFries className="menu" onClick={changeDisplay} />
                )}

                <NavLink className="h1-link" to="/">
                  <h1>
                    {title}
                    <GiAfrica className="africalogo" />
                    <sup>
                      <GiCrown className="crown" />
                    </sup>
                  </h1>
                </NavLink>
              </div>

              <div className="cart-search">
                <p
                  onClick={handleSearchDisplay}
                  className="small-screen-search-button"
                >
                  <BsSearch />
                </p>

                <NavLink className="cart-link" to="/cart">
                  <BsCart />
                  <sup>{localCartLength}</sup>
                </NavLink>
              </div>
            </nav>

            <div
              className={`small-nav-links ${
                displayNav ? "show-nav" : "hide-nav"
              }`}
            >
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/fabrics"
              >
                <GiRolledCloth />
                <p>Fabrics</p>
              </NavLink>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/faqs"
              >
                <GrCircleQuestion />
                <p>FAQs</p>
              </NavLink>

              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/contact"
              >
                <p>Contact US</p>
              </NavLink>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/login"
              >
                <p>Login</p>
              </NavLink>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "picked nav-link" : `nav-link ${slideout}`
                }
                onClick={changeDisplay}
                to="/signup"
              >
                <p>Signup</p>
              </NavLink>
            </div>
            {searchDisplay ? (
              <form
                className={` search-input-container ${
                  searchDisplay ? "show-search-input" : "hide-search-input"
                }`}
                onSubmit={handleSearch}
              >
                <input
                  className="search-input"
                  type="search"
                  placeholder="enter keyword"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </form>
            ) : (
              ""
            )}
          </div>
        )}
      </header>
    </div>
  );
}
export default Header;
