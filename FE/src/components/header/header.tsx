"use client";
import { useEffect, useState, useContext } from "react";
import "./header.css";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BsCart } from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { toast } from "react-hot-toast";
import { GiRolledCloth } from "react-icons/gi";
import Link from "next/link";
import { GiAfrica } from "react-icons/gi";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { ProductContext } from "../productContext";
import { BsSearch, BsX } from "react-icons/bs";
import { GiCrown } from "react-icons/gi";
import { GrCircleQuestion } from "react-icons/gr";
import { title } from "../globalPhrases";
import { useCurrency } from "../currency/currencyContext";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [displayNav, SetDisplayNav] = useState(false);
  const { 
    authenticated, 
    setAuthenticated, 
    cartCount, 
    setShouldSearch 
  } = useContext(ProductContext)!;
  const [slideout, setSlideOut] = useState("");
  const [searchDisplay, setSearchDisplay] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { exchangeRate } = useCurrency();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

  function handleSearchDisplay() {
    setSearchDisplay(!searchDisplay);
    if (!searchDisplay) {
      setTimeout(() => {
        document.getElementById('header-search-input')?.focus();
      }, 100);
    }
  }

  async function handleSearch(e: any) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${searchTerm}`);
      setShouldSearch(true);
      setSearchDisplay(false);
    }
  }

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
          ["authToken", "token", "localCartList", "fullname", "email", "total"].forEach(
            (item) => localStorage.removeItem(item)
          );
          changeDisplay();
          setAuthenticated(false);
          router.push("/");
          window.location.reload();
        }
      });
  };

  return (
    <div>
      <header>
        <div>
          <nav className="big-screen-nav">
            <div>
              <Link className="h1-link" href="/">
                <h1>
                  {title}
                  <GiAfrica className="africalogo" />
                  <sup>
                    <GiCrown className="crown" />
                  </sup>
                </h1>
              </Link>
            </div>

            <div className="header-links">
              <Link
                className={pathname === "/fabrics" ? "picked big-screen-link" : "big-screen-link"}
                href="/fabrics"
              >
                <GiRolledCloth />
                <p>Fabrics</p>
              </Link>

              <Link
                className={pathname === "/faqs" ? "picked big-screen-link" : "big-screen-link"}
                href="/faqs"
              >
                <GrCircleQuestion />
                <p>FAQs</p>
              </Link>

              <Link
                className={pathname === "/contact" ? "picked big-screen-link" : "big-screen-link"}
                href="/contact"
              >
                <BsFillTelephoneInboundFill />
                <p>Contact Us </p>
              </Link>
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

              <Link className="cart-link" href="/cart">
                <BsCart />
                <sup>{cartCount}</sup>
              </Link>

              {authenticated ? (
                <p
                  className="big-screen-link logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              ) : (
                <>
                  <Link
                    className={pathname === "/signup" ? "picked big-screen-link" : "big-screen-link"}
                    href="/signup"
                  >
                    Signup
                  </Link>
                  <Link
                    className={pathname === "/login" ? "picked big-screen-link" : "big-screen-link"}
                    href="/login"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>

          <nav className="small-screen-nav">
            <div className="h1-menu">
              {displayNav ? (
                <MdCancel className="menu" onClick={changeDisplay} />
              ) : (
                <CiMenuFries className="menu" onClick={changeDisplay} />
              )}

              <Link className="h1-link" href="/">
                <h1>
                  {title}
                  <GiAfrica className="africalogo" />
                  <sup>
                    <GiCrown className="crown" />
                  </sup>
                </h1>
              </Link>
            </div>

            <div className="cart-search">
              <p
                onClick={handleSearchDisplay}
                className="small-screen-search-button"
              >
                <BsSearch />
              </p>

              <Link className="cart-link" href="/cart">
                <BsCart />
                <sup>{cartCount}</sup>
              </Link>
            </div>
          </nav>

          <div
            className={`small-nav-links ${
              displayNav ? "show-nav" : "hide-nav"
            }`}
          >
            <Link
              className={pathname === "/fabrics" ? "picked nav-link" : `nav-link ${slideout}`}
              onClick={changeDisplay}
              href="/fabrics"
            >
              <GiRolledCloth />
              <p>Fabrics</p>
            </Link>
            <Link
              className={pathname === "/faqs" ? "picked nav-link" : `nav-link ${slideout}`}
              onClick={changeDisplay}
              href="/faqs"
            >
              <GrCircleQuestion />
              <p>FAQs</p>
            </Link>

            <Link
              className={pathname === "/contact" ? "picked nav-link" : `nav-link ${slideout}`}
              onClick={changeDisplay}
              href="/contact"
            >
              <p>Contact US</p>
            </Link>
            
            {authenticated ? (
              <button className="nav-link logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link
                  className={pathname === "/login" ? "picked nav-link" : `nav-link ${slideout}`}
                  onClick={changeDisplay}
                  href="/login"
                >
                  <p>Login</p>
                </Link>
                <Link
                  className={pathname === "/signup" ? "picked nav-link" : `nav-link ${slideout}`}
                  onClick={changeDisplay}
                  href="/signup"
                >
                  <p>Signup</p>
                </Link>
              </>
            )}
          </div>
          {searchDisplay && (
            <div className={`search-overlay ${searchDisplay ? "active" : ""}`}>
              <form
                className="search-input-container"
                onSubmit={handleSearch}
              >
                <BsSearch className="search-icon-inner" />
                <input
                  id="header-search-input"
                  className="search-input"
                  type="search"
                  placeholder="Search for fabrics, styles, tribes..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <BsX className="close-search" onClick={handleSearchDisplay} />
              </form>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;