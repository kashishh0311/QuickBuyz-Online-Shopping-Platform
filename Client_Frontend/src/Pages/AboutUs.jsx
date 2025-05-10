import React from "react";
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  Star,
  Heart,
  Mail,
  Users,
} from "lucide-react";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center">
          <ShoppingBag className="mr-2 h-8 w-8 text-blue-600" />
          About QuickBuyz
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="mr-2 h-6 w-6 text-yellow-500" />
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to QuickBuyz, your one-stop online shopping destination!
            Founded in 2023, QuickBuyz was created with a simple mission: to
            make shopping fast, convenient, and enjoyable for everyone. We
            started as a small team passionate about delivering quality products
            and exceptional customer service, and today, we're proud to serve
            customers across the globe.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Truck className="mr-2 h-6 w-6 text-blue-600" />
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At QuickBuyz, we believe in providing a seamless shopping
            experience. Our goal is to offer a wide range of high-quality
            products at competitive prices, backed by reliable delivery and
            outstanding support. Whether you're shopping for electronics,
            fashion, home essentials, or gifts, we've got you covered.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="mr-2 h-6 w-6 text-red-500" />
            Our Values
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At QuickBuyz, our values guide everything we do. We are committed
            to:
          </p>
          <ul className="list-none text-gray-600 space-y-3 mt-3">
            <li className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Customer Satisfaction: Your happiness is our priority.
            </li>
            <li className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Integrity: We uphold honesty and transparency in all our dealings.
            </li>
            <li className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Innovation: We continuously improve to bring you the best shopping
              experience.
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2 h-6 w-6 text-purple-600" />
            Our Team
          </h2>
          <p className="text-black leading-relaxed">
            The QuickBuyz team is a diverse group of innovators, creators, and
            customer service enthusiasts dedicated to making your shopping
            experience exceptional. From our product curators who source the
            best items to our logistics experts ensuring timely delivery, every
            member of our team is driven by a passion for excellence. We work
            together to bring you a platform that’s reliable, user-friendly, and
            packed with value.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="mr-2 h-6 w-6 text-green-600" />
            Why Shop with Us?
          </h2>
          <ul className="list-none text-gray-600 space-y-3">
            <li className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-blue-600" />
              Fast and reliable shipping to your doorstep
            </li>
            <li className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Curated selection of top-quality products
            </li>
            <li className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              Secure and hassle-free payment options
            </li>
            <li className="flex items-center">
              <Headphones className="mr-2 h-5 w-5 text-blue-600" />
              24/7 customer support to assist you
            </li>
            <li className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Exclusive deals and discounts for our loyal customers
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="mr-2 h-6 w-6 text-blue-600" />
            Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We're here to assist you! Reach out to us through the following
            channels:
          </p>
          <div className="text-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Customer Support
            </h3>
            <p className="flex items-center mb-2">
              <Mail className="mr-2 h-5 w-5 text-blue-600" />
              Email:{" "}
              <a
                href="mailto:support@quickbuyz.com"
                className="text-blue-600 hover:underline ml-1"
              >
                support@quickbuyz.com
              </a>
            </p>
            <p className="flex items-center mb-2">
              <Headphones className="mr-2 h-5 w-5 text-blue-600" />
              Phone:{" "}
              <a
                href="tel:+15551234567"
                className="text-blue-600 hover:underline ml-1"
              >
                +1 (555) 123-4567
              </a>
            </p>
            <p className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Hours: Mon-Fri, 9 AM - 6 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
