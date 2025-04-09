import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/home/home";
import Fabrics from "./components/sections/fabrics";
import Signup from "./components/forms/signup";
import Login from "./components/forms/login";
import Cart from "./components/cart/cart";
import ItemsInfo from "./components/sections/itemsInfo";
import SearchResults from "./components/sections/searchResults";
import CheckoutPage from "./components/checkout/checkout";
import Faq from "./components/faq/faq";
import VerifyPage from "./components/checkout/verify";
import ContactUs from "./components/contactUs/contactUs";
import ForgotPassword from "./components/forms/forgotPassword";
import ResetPassword from "./components/forms/resetPassword";

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
      { element: <ForgotPassword />, path: "/forgot-password" },
      { element: <ResetPassword />, path: "/reset-password/:token" },
    ],
  },
]);
