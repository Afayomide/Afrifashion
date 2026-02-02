"use client";
import { memo, useEffect, useState, useMemo } from "react";
import useFabricStore from "../stores/useHomeStore";
import Link from "next/link";
import ProductCard from "../cards/ProductCard";
import "./home.scss";
import { title } from "../globalPhrases";
import { useCurrency } from "../currency/currencyContext";
import logo2 from "../../assets/logo2.webp";
import { ChevronRight, Truck, ShieldCheck, Clock, Award } from "lucide-react";
import Image from "next/image";
import { applyExchangeRate } from "../currency/exchangeRate";

const Home = memo(({ initialData }: { initialData: any }) => {
  const { exchangeRate } = useCurrency();
  const { fetchData } = useFabricStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (exchangeRate) {
      fetchData(exchangeRate);
    }
  }, [exchangeRate, fetchData]);

  const displayData = useMemo(() => {
    if (!initialData) return null;
    
    // If not mounted or no exchangeRate yet, return original data
    if (!mounted || !exchangeRate) return initialData;

    // Apply exchange rate to server data for client-side consistency
    return {
      asoOke: applyExchangeRate(initialData.asoOke, exchangeRate),
      lace: applyExchangeRate(initialData.lace, exchangeRate),
      dansiki: applyExchangeRate(initialData.dansiki, exchangeRate),
      gele: applyExchangeRate(initialData.gele, exchangeRate),
      ankara: applyExchangeRate(initialData.ankara, exchangeRate),
    };
  }, [initialData, exchangeRate, mounted]);

  const sections = [
    { title: "Ankara", data: displayData?.ankara || [], query: "ankara" },
    { title: "Aso Oke (Top Cloth)", data: displayData?.asoOke || [], query: "aso-oke" },
    { title: "Dansiki", data: displayData?.dansiki || [], query: "dansiki" },
    { title: "Lace", data: displayData?.lace || [], query: "lace" },
  ];

  const features = [
    { icon: <Truck size={24} />, title: "Global Shipping", desc: "Fast delivery to your doorstep worldwide" },
    { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "100% secure payment processing" },
    { icon: <Award size={24} />, title: "Premium Quality", desc: "Authentic African fabrics of the highest grade" },
    { icon: <Clock size={24} />, title: "24/7 Support", desc: "Our team is always here to help you" },
  ];

  return (
    <div className="home-container">
      <h3 className="welcome">      </h3>

      <div className="hero-section">
        <div className="hero-image">
          <Image src={logo2} alt="Hero" />
          <div className="hero-overlay">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">
              Premium quality fabrics for your unique style<br />
              24/7 shopping and delivery
            </p>
            <Link href="https://wa.link/xk588j" className="hero-cta">
              Special Order? <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="home-top-section-links">
        <Link href="/fabrics" className="home-link">
          All Fabrics
        </Link>
        <Link href="/search?q=ankara" className="home-link">
          Ankara
        </Link>
        <Link href="/search?q=dansiki" className="home-link">
          Dansiki
        </Link>
        <Link href="/search?q=lace" className="home-link">
          lace
        </Link>
      </div>

      <div className="home-content">
        {sections.map(({ title, data, query }) => (
          data.length > 0 && (
            <div className="home-fabric-section" key={query}>
              <div className="section-header-container">
                <h3>
                  <Link className="home-section-link" href={`/search?q=${query}`}>
                    {title}
                  </Link>
                </h3>
                <Link href={`/search?q=${query}`} className="view-all">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              <div className="products-grid">
                {data.map((item: any, index: number) => (
                  <ProductCard key={item._id} {...item} index={index} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
});

export default Home;
