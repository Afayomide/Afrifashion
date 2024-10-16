import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Header from "./components/header/header";
import Home from "./components/home/home";
import Fabrics from "./components/sections/fabrics";
import Footer from "./components/footer/footer";
import Signup from "./components/forms/signup";
import Login from "./components/forms/login";
import Cart from "./components/cart/cart";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { ProductProvider } from "./components/productContext";
import ItemsInfo from "./components/sections/itemsInfo";
import AboutUs from "./components/aboutus/aboutus";
import SearchResults from "./components/sections/searchResults";
import CheckoutPage from "./components/checkout/checkout";
import Faq from "./components/sections/faq";
import VerifyPage from "./components/checkout/verify";
import ContactUs from "./components/contactUs/contactUs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { element: <Home />, path: "/" },
      { element: <Fabrics />, path: "/fabrics" },
      { element: <Signup />, path: "/signup" },
      { element: <Login />, path: "/login" },
      { element: <Cart />, path: "/cart" },
      { element: <ContactUs />, path: "/contact" },
      { element: <ItemsInfo />, path: "/:id" },
      { path: "/search", element: <SearchResults /> },
      { element: <CheckoutPage />, path: "/checkout" },
      { element: <VerifyPage />, path: "/verify" },
      { element: <Faq />, path: "/faqs" },
    ],
  },
]);
