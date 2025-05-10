import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const showCustomModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showAboutUs = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "About Us",
      <div>
        <p className="text-sm">
          QuickBuyz was founded in 2025 with a mission to be your one-stop
          destination for trendy and affordable fashion. We deliver quality
          products fast, ensuring a seamless shopping experience.
        </p>
        <p className="text-sm mt-2">
          Our team is dedicated to curating the latest fashion trends, offering
          a wide range of products to suit every style and budget. From casual
          wear to statement pieces, we have it all.
        </p>
        <p className="text-sm mt-2">
          With a focus on customer satisfaction, we provide efficient delivery
          and excellent support. Shop with us and discover fashion that fits
          your lifestyle.
        </p>
      </div>
    );
  };

  const showContact = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Contact Us",
      <div>
        <p className="text-sm">
          We're here to assist you! Reach out to us through the following
          channels:
        </p>
        <h4 className="font-semibold mt-2">Customer Support</h4>
        <p className="text-sm">Email: support@quickbuyz.com</p>
        <p className="text-sm">Phone: +1 (555) 123-4567</p>
        <p className="text-sm">Hours: Mon-Fri, 9 AM - 6 PM</p>
      </div>
    );
  };

  const showPrivacyPolicy = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Privacy Policy",
      <div>
        <p className="text-sm">
          At QuickBuyz, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your
          personal information.
        </p>
        <h4 className="font-semibold mt-2">1. Information We Collect</h4>
        <p className="text-sm">
          We collect personal data such as your name, email, address, and
          payment details when you shop with us. We also gather non-personal
          data like browsing behavior to enhance your experience.
        </p>
        <h4 className="font-semibold mt-2">2. How We Use Your Information</h4>
        <p className="text-sm">
          Your data helps us process orders, improve our services, and send you
          updates or promotions. We do not share your information with third
          parties for marketing purposes.
        </p>
        <h4 className="font-semibold mt-2">3. Data Security</h4>
        <p className="text-sm">
          We use encryption and secure servers to protect your data. While we
          take every precaution, no online system is 100% secure.
        </p>
        <h4 className="font-semibold mt-2">4. Your Rights</h4>
        <p className="text-sm">
          You can access, update, or delete your data. Contact us at{" "}
          <a href="mailto:support@quickbuyz.com" className="text-blue-400">
            support@quickbuyz.com
          </a>{" "}
          for any privacy concerns.
        </p>
      </div>
    );
  };

  const showTermsOfService = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Terms & Conditions",
      <div>
        <p className="text-sm">
          By using QuickBuyz, you agree to the following terms and conditions:
        </p>
        <h4 className="font-semibold mt-2">1. Account Usage</h4>
        <p className="text-sm">
          You must provide accurate information when creating an account. You
          are responsible for keeping your account secure.
        </p>
        <h4 className="font-semibold mt-2">2. Orders and Payments</h4>
        <p className="text-sm">
          You agree to pay the full amount at checkout. QuickBuyz reserves the
          right to cancel orders due to payment issues or fraud.
        </p>
        <h4 className="font-semibold mt-2">3. Shipping & Returns</h4>
        <p className="text-sm">
          We aim to deliver promptly, but delays may occur. Returns are accepted
          as per our policy outlined on the website.
        </p>
        <h4 className="font-semibold mt-2">4. User Conduct</h4>
        <p className="text-sm">
          Any misuse of the platform may lead to account suspension. Contact us
          at{" "}
          <a href="mailto:support@quickbuyz.com" className="text-blue-400">
            support@quickbuyz.com
          </a>{" "}
          for questions.
        </p>
      </div>
    );
  };

  const showShippingReturns = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Shipping & Returns",
      <div>
        <p className="text-sm">
          We strive to make shopping with QuickBuyz seamless. Here's our policy
          on shipping and returns:
        </p>
        <h4 className="font-semibold mt-2">Shipping</h4>
        <p className="text-sm">
          Orders are processed within 1-2 business days. Standard shipping takes
          3-5 days, while expedited options are available at checkout.
        </p>
        <h4 className="font-semibold mt-2">Returns</h4>
        <p className="text-sm">
          Returns are accepted within 30 days of delivery, provided items are
          unused and in original packaging. Contact us to initiate a return.
        </p>
      </div>
    );
  };

  const showFAQ = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "FAQ",
      <div>
        <p className="text-sm">
          Common questions about shopping with QuickBuyz:
        </p>
        <h4 className="font-semibold mt-2">1. How long does shipping take?</h4>
        <p className="text-sm">Standard shipping takes 3-5 business days.</p>
        <h4 className="font-semibold mt-2">2. Can I return an item?</h4>
        <p className="text-sm">
          Yes, within 30 days if the item is unused and in its original
          packaging.
        </p>
        <h4 className="font-semibold mt-2">3. How do I track my order?</h4>
        <p className="text-sm">
          A tracking link will be sent to your email once your order ships.
        </p>
      </div>
    );
  };

  const showSizeGuide = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Size Guide",
      <div>
        <p className="text-sm">
          Use this guide to find the perfect fit for QuickBuyz clothing:
        </p>
        <h4 className="font-semibold mt-2">General Sizing</h4>
        <p className="text-sm">
          Small: Chest 34-36", Waist 28-30"
          <br />
          Medium: Chest 38-40", Waist 32-34"
          <br />
          Large: Chest 42-44", Waist 36-38"
          <br />
          X-Large: Chest 46-48", Waist 40-42"
        </p>
        <h4 className="font-semibold mt-2">Tips for Measuring</h4>
        <p className="text-sm">
          Use a measuring tape to measure your chest and waist. If you're
          between sizes, we recommend sizing up for comfort.
        </p>
      </div>
    );
  };

  return (
    <div>
      <footer className="bg-black p-8 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Branding and Description */}
          <div>
            <h3 className="text-lg font-bold mb-4">QuickBuyz</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your one-stop destination for trendy and affordable fashion.
              Quality products delivered fast.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "All Products",
                      <p className="text-sm">
                        Explore our full range of products.
                      </p>
                    )
                  }
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "New Arrivals",
                      <p className="text-sm">
                        Check out the latest additions to our collection.
                      </p>
                    )
                  }
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Best Seller",
                      <p className="text-sm">
                        Discover our most popular items.
                      </p>
                    )
                  }
                >
                  Best Seller
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Sale",
                      <p className="text-sm">
                        Grab great deals on our discounted items.
                      </p>
                    )
                  }
                >
                  Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showContact}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showShippingReturns}
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showFAQ}
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showSizeGuide}
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showAboutUs}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Careers",
                      <p className="text-sm">
                        Join our team! Check out available positions.
                      </p>
                    )
                  }
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showPrivacyPolicy}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showTermsOfService}
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-300">
            © 2025 QuickBuyz. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom Modal Implementation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto text-white">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
              <button
                onClick={closeModal}
                className="text-black hover:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-black">{modalContent}</div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Footer;
