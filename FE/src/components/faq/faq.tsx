"use client";

import { useState } from "react";
import "./faq.css";
import {
  ChevronDown,
  Shirt,
  Truck,
  Palette,
  Scissors,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";

function Faq() {
  const [openItems, setOpenItems] = useState({});

  // Toggle FAQ item open/closed
  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // FAQ data organized by categories
  const faqCategories = [
    {
      id: "about",
      title: "About African Fabrics",
      icon: <Palette size={24} />,
      questions: [
        {
          id: "why-african",
          question: "Why African Fabrics?",
          answer:
            "African fashion is colorful, bold and diverse. Wherever you are in the world, representing Africa by rocking her fabrics will help you stand out and become more recognized. African fabrics tell stories through their patterns and colors, connecting you to rich cultural heritage and traditions that span centuries.",
        },
        {
          id: "fabric-types",
          question: "What types of African fabrics do you offer?",
          answer:
            "We offer a wide variety of authentic African fabrics including Ankara (Dutch wax prints), Kente cloth from Ghana, Kitenge and Kikoy from East Africa, Mud cloth (Bogolanfini) from Mali, and Adire from Nigeria. Each fabric has its own unique history, production technique, and cultural significance.",
        },
        {
          id: "fabric-quality",
          question: "How can I tell the quality of African fabrics?",
          answer:
            "High-quality African fabrics typically have vibrant, consistent colors that don't easily fade, tight weaving with no loose threads, and designs printed on both sides with equal intensity. Premium fabrics like authentic Dutch wax prints have a distinctive smell and crackling sound when crumpled. All our fabrics are carefully sourced to ensure the highest quality.",
        },
        {
          id: "fabric-care",
          question: "How should I care for my African fabrics?",
          answer:
            "We recommend hand washing your African fabrics in cold water with mild detergent. Avoid bleach and harsh chemicals. Air dry in shade to prevent color fading. For storage, keep fabrics in a cool, dry place away from direct sunlight. Some fabrics may require special care, which will be noted in the product description.",
        },
      ],
    },
    {
      id: "uses",
      title: "What You Can Create",
      icon: <Scissors size={24} />,
      questions: [
        {
          id: "fabric-uses",
          question: "What can you do with African fabrics?",
          answer: (
            <div>
              <p>
                <strong>Fashion Statements:</strong> African fabrics are perfect
                for creating one-of-a-kind clothing. Dresses, shirts, skirts,
                pants, and even headwraps can be made using vibrant prints. You
                can find sewing patterns online or in stores, or have something
                custom-made to your liking. Contact our tailors to sew anything
                you want and ship to you wherever you are in the world.
              </p>
              <p>
                <strong>Decoration:</strong> The beauty of African fabrics goes
                beyond apparel. Liven up your home decor with throw pillows,
                table runners, or unique wall hangings.
              </p>
              <p>
                <strong>Accessorize with Flair:</strong> Make a bold statement
                with a clutch purse, tote bag, belt, headband, or scarf made
                from African fabric.
              </p>
              <p>
                <strong>More Than Meets the Eye:</strong> African fabrics aren't
                just for sewing! Wrap presents in unique style or breathe new
                life into old furniture with upholstery. You can even get
                creative and make phone cases, coasters, or jewelry using fabric
                scraps.
              </p>
            </div>
          ),
        },
        {
          id: "fashion-trends",
          question: "What are the current fashion trends with African fabrics?",
          answer:
            "Current trends include mixing traditional African prints with contemporary silhouettes, color blocking with different patterns, African-inspired workwear, and sustainable fashion using upcycled fabric scraps. Ankara jumpsuits, maxi dresses with modern cuts, and statement accessories are particularly popular. Our blog regularly features the latest trends and styling tips.",
        },
        {
          id: "home-decor",
          question: "How can I incorporate African fabrics into home decor?",
          answer:
            "African fabrics add vibrant personality to any space! Create accent pillows, table runners, curtains, or framed fabric art. Upholster a statement chair or ottoman, make lampshades, or create a stunning wall hanging. Even small touches like fabric-covered plant pots or picture frames can transform your space with African-inspired elegance.",
        },
        {
          id: "beginner-projects",
          question: "What are some easy projects for beginners?",
          answer:
            "If you're new to working with African fabrics, start with simple projects like tote bags, pillow covers, headbands, or table runners. No-sew options include fabric-wrapped picture frames, cork boards covered with fabric, or fabric wall art using embroidery hoops. Check our blog for step-by-step tutorials designed especially for beginners.",
        },
      ],
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: <Truck size={24} />,
      questions: [
        {
          id: "worldwide-shipping",
          question: "Do you ship worldwide?",
          answer:
            "Yes, we work with DHL to deliver your fabrics anywhere in the world. Our global shipping network ensures your beautiful African fabrics reach you safely and promptly, no matter where you are located.",
        },
        {
          id: "shipping-time",
          question: "How long does shipping take?",
          answer:
            "Shipping times vary by location. Domestic orders typically arrive within 3-5 business days. International shipping generally takes 7-14 business days, depending on your location and local customs processing. Express shipping options are available at checkout for faster delivery.",
        },
        {
          id: "shipping-cost",
          question: "How much does shipping cost?",
          answer:
            "Shipping costs are calculated based on weight, dimensions, and destination. You can view the exact shipping cost during checkout before completing your purchase. We offer free shipping on orders over $150 for domestic customers and over $250 for international customers.",
        },
        {
          id: "track-order",
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a confirmation email with a tracking number and link. You can also log into your account on our website to view real-time updates on your order status. If you have any questions about your shipment, our customer service team is always ready to assist you.",
        },
      ],
    },
    {
      id: "orders",
      title: "Orders & Payment",
      icon: <ShoppingBag size={24} />,
      questions: [
        {
          id: "custom-orders",
          question: "Do you accept custom orders?",
          answer:
            "Yes! We love helping customers bring their vision to life. Whether you need specific fabric quantities, custom cuts, or are looking for a particular pattern or color, we can help. For custom orders, please contact our customer service team with your requirements, and we'll work with you to fulfill your needs.",
        },
        {
          id: "payment-methods",
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. For international customers, we also accept bank transfers. All payments are processed securely to ensure your financial information remains protected.",
        },
        {
          id: "return-policy",
          question: "What is your return policy?",
          answer:
            "We accept returns within 30 days of delivery for unused fabrics in their original condition. Custom-cut fabrics and sale items are final sale. To initiate a return, please contact our customer service team. Once we receive and inspect your return, we'll process your refund within 5-7 business days.",
        },
        {
          id: "wholesale",
          question: "Do you offer wholesale pricing?",
          answer:
            "Yes, we offer wholesale pricing for bulk orders and business customers. Whether you're a fashion designer, retailer, or interior decorator, we can provide competitive pricing for larger quantities. Please contact our wholesale department for a personalized quote and to discuss your specific requirements.",
        },
      ],
    },
    {
      id: "tailoring",
      title: "Tailoring Services",
      icon: <Shirt size={24} />,
      questions: [
        {
          id: "tailoring-services",
          question: "Do you offer tailoring services?",
          answer:
            "Yes, we partner with skilled tailors who specialize in working with African fabrics. Our tailors can create custom garments based on your measurements and design preferences. From traditional styles to contemporary fashion, our tailoring service brings your vision to life with expert craftsmanship.",
        },
        {
          id: "tailoring-process",
          question: "How does the tailoring process work?",
          answer:
            "After selecting your fabric, you can choose from our design templates or submit your own design. We'll need your measurements, which you can provide using our measurement guide. Our tailors will create your garment and we'll ship the finished piece directly to you. The entire process typically takes 2-3 weeks, depending on complexity.",
        },
        {
          id: "tailoring-cost",
          question: "How much does tailoring cost?",
          answer:
            "Tailoring costs vary based on the complexity of the design and type of garment. Basic items like skirts start at $50, while more complex pieces like fully lined dresses or suits range from $100-$300. You'll receive a detailed quote before we begin work, so there are no surprises.",
        },
        {
          id: "design-help",
          question:
            "Can you help me design something if I'm not sure what I want?",
          answer:
            "Our design consultation service connects you with experienced fashion designers who can help bring your ideas to life. Whether you have a specific occasion in mind or just want to explore possibilities, our designers will work with you to create something that fits your style, body type, and preferences.",
        },
      ],
    },
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <HelpCircle size={32} className="faq-title-icon" />
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers to common questions about our African fabrics, shipping,
          and more
        </p>
      </div>

      <div className="faq-content">
        {faqCategories.map((category) => (
          <div key={category.id} className="faq-category">
            <div className="category-header">
              {category.icon}
              <h2>{category.title}</h2>
            </div>

            <div className="faq-questions">
              {category.questions.map((item) => (
                <div
                  key={item.id}
                  className={`faq-item ${openItems[item.id] ? "open" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={openItems[item.id]}
                  >
                    <span>{item.question}</span>
                    <ChevronDown className="faq-icon" />
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-content">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <div className="faq-contact-info">
          <h3>Still have questions?</h3>
          <p>
            Our customer service team is here to help you with any questions you
            may have.
          </p>
          <button className="contact-button">Contact Us</button>
        </div>
      </div>
    </div>
  );
}

export default Faq;
