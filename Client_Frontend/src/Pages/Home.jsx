import React, { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqData = [
    {
      question: "What payment methods do you accept?",
      answer:
        "Shopping is easy with QuickBuyz! We accept UPI, Credit/Debit Cards, and Cash on Delivery (COD).",
    },
    {
      question: "Do you offer returns or exchanges?",
      answer:
        "Yes! We offer hassle-free returns and exchanges within 7 days of delivery on eligible items. Check the product page for specific return policies.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Most orders are delivered within 2-5 business days. You'll receive real-time tracking updates once your order is shipped.",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="bg-gray-100">
      <div
        className="pr-2 overflow-y-auto h-[95vh]"
        style={{
          msOverflowStyle: "none", // For IE/Edge (legacy)
          scrollbarWidth: "none", // For Firefox
        }}
      >
        {/* Intro starts here */}
        <section className="relative w-full h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
              filter: "brightness(0.7)",
            }}
          />

          <div className="container relative h-full flex flex-col justify-center items-start p-4">
            <div className="max-w-xl animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Summer Collection 2025
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
                Discover our latest styles with free shipping on all orders over
                ₹500.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                  <Link to="/product">Shop Now</Link>
                </button>
                <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                  <Link to="/aboutUs">Learn More</Link>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Top food starts here */}

        <div className="py-12 pb-2">
          <div className="max-w-8xl mx-auto px-12 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Featured Products
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg hover:shadow-lg transition duration-300 ease-in-out p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Product Image"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 ">
                  Modern Girls Bag
                </h3>
                <p className="text-gray-600 flex-grow ">₹500</p>
                <p className="text-gray-600 flex-grow mb-4">Bags</p>
              </div>

              <div className="bg-white rounded-lg hover:shadow-lg transition duration-300 ease-in-out p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Our Chef"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 ">
                  Comfort Sneakers
                </h3>
                <p className="text-gray-600 flex-grow ">₹1200</p>
                <p className="text-gray-600 flex-grow mb-4">Footwear</p>
              </div>
              <div className="bg-white rounded-lg hover:shadow-lg transition duration-300 ease-in-out p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Our Chef"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 ">
                  Classic Denim Jacket
                </h3>
                <p className="text-gray-600 flex-grow ">₹400</p>
                <p className="text-gray-600 flex-grow mb-4">Women's Clothing</p>
              </div>

              <div className="bg-white rounded-lg hover:shadow-lg transition duration-300 ease-in-out p-6 flex flex-col">
                <div className="relative h-80 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-50 bg-repeat bg-center">
                    <img
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Our Chef"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-800 ">
                  Smart Watch
                </h3>
                <p className="text-gray-600 flex-grow ">₹1000</p>
                <p className="text-gray-600 flex-grow mb-4">Electronics</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/product">
              <button className="relative inline-flex items-center justify-start overflow-hidden transition-all duration-500 ease-in-out group w-44 h-14">
                {/* Expanding Background */}
                <span className="absolute left-0 flex items-center justify-center w-12 h-12 transition-all duration-500 ease-in-out bg-black rounded-full group-hover:w-full group-hover:rounded-lg"></span>

                {/* Stable Arrow Head (Now Positioned Outside Expanding Element) */}
                <span className="relative z-10 ml-4 w-3 h-3 border-t-2 border-r-2 border-white rotate-45"></span>

                {/* Button Text */}
                <span className="relative z-10 ml-6 text-gray-800 font-bold uppercase text-sm tracking-widest transition-all duration-500 ease-in-out group-hover:text-white">
                  View More
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Achivements starts here */}

        <div className="flex items-center justify-evenly p-8 mt-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 ">
              Service shows <br />
              good taste.
            </h1>
          </div>
          <div className="flex">
            <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
              <h2 className="text-4xl font-bold text-black hover:text-gray-800">
                976
              </h2>
              <p className="text-gray-500">Satisfied Customer</p>
            </div>
            <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
              <h2 className="text-4xl font-bold text-black hover:text-gray-800">
                99+
              </h2>
              <p className="text-gray-500">Product Selections</p>
            </div>
            <div className="text-center mx-5 bg-white rounded-lg shadow-md p-6 w-52">
              <h2 className="text-4xl font-bold text-black hover:text-gray-800">
                1K+
              </h2>
              <p className="text-gray-500">Product Delivered</p>
            </div>
          </div>
        </div>
        {/* review starts here */}

        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                What Shoppers Are Saying...
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="pr-4">
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                      alt="User Profile"
                      className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Maria Rodriguez
                    </h3>
                    <p className="text-gray-600 text-sm">@mariarodriguez</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  The items I ordered arrived on time and in perfect condition!
                  QuickBuyz has become my go-to for online shopping—great
                  quality, fast shipping, and reliable service every time.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="pr-4">
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                      alt="User Profile"
                      className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      David Chen
                    </h3>
                    <p className="text-gray-600 text-sm">@davidchen</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  QuickBuyz has completely changed how I shop online. I can
                  easily browse products, find great deals, and check out in
                  seconds. It’s fast, smooth, and super convenient.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="pr-4">
                    <img
                      src="https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg"
                      alt="User Profile"
                      className="h-14 w-14 rounded-full border-2 shadow-md bg-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mx-9">
                      Sarah Miller
                    </h3>
                    <p className="text-gray-600 text-sm">@sarahmiller</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  This app is a lifesaver! The user interface is clean and makes
                  shopping enjoyable. Plus, the delivery was quick and the items
                  were exactly as shown—highly recommended!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* last redirect starts here */}

        <div className="p-8 rounded-lg flex flex-col md:flex-row mt-10">
          <div className="md:w-1/2 md:pr-8 content-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Get Started Today!
            </h2>
            <p className="text-gray-600 mb-6 text-xl">
              QuickBuyz – Smart shopping made simple, with fast delivery and
              quality you can trust.
            </p>
            <div className="flex space-x-4">
              <button className=" bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
                <Link to="/product">Get Started</Link>
              </button>
            </div>
          </div>

          <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gray-300 bg-opacity-50 h-full w-full bg-center">
              <img
                src="/Last_Redirect.jpg"
                alt="Food Image"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* FAQ starts here */}

        <div className="p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">FAQ</h2>

          <div className="space-y-4 mx-10">
            {faqData.map((item, index) => (
              <div key={index}>
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleAnswer(index)}
                >
                  <span className="font-medium">{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      activeQuestion === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    activeQuestion === index ? "block" : "hidden"
                  } mt-2`}
                >
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
