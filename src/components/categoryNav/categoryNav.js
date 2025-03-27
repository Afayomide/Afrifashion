"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./categoryNav.scss";
import { FactoryIcon as Fabric, Shirt, Palette, Scissors } from "lucide-react";

const CategoryNav = () => {
  const [isFixed, setIsFixed] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const initialTopPosition = useRef(null);

  const categories = [
    {
      id: "ankara",
      name: "Ankara",
      path: "/search?q=ankara",
      icon: <Fabric size={18} />,
      color: "#FF9800",
    },
    {
      id: "aso-oke",
      name: "Aso Oke",
      path: "/search?q=aso-oke",
      icon: <Palette size={18} />,
      color: "#4CAF50",
    },
    {
      id: "dansiki",
      name: "Dansiki",
      path: "/search?q=dansiki",
      icon: <Shirt size={18} />,
      color: "#2196F3",
    },
    {
      id: "lace",
      name: "Lace",
      path: "/search?q=lace",
      icon: <Scissors size={18} />,
      color: "#9C27B0",
    },
  ];

  // Determine active category based on URL
  const getActiveCategory = () => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");
    return categories.find((cat) => cat.id === query)?.id || null;
  };

  const activeCategory = getActiveCategory();

  useEffect(() => {
    // Get the initial position of the nav after the component mounts
    if (navRef.current && initialTopPosition.current === null) {
      initialTopPosition.current =
        navRef.current.getBoundingClientRect().top + window.scrollY;
    }

    const handleScroll = () => {
      if (initialTopPosition.current === null || !navRef.current) return;

      // Check if we've scrolled past the initial position of the nav
      if (window.scrollY > initialTopPosition.current) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={navRef}
      className={`category-nav ${isFixed ? "fixed" : ""}`}
      style={isFixed ? { paddingTop: "0.75rem", paddingBottom: "0.75rem" } : {}}
    >
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        className="category-swiper"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="category-slide">
            <Link
              to={category.path}
              className={`category-link ${
                activeCategory === category.id ? "active" : ""
              }`}
              style={{ "--category-color": category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <span className="category-name">{category.name}</span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryNav;
