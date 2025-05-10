import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetails";
import Order from "./Pages/Order";
import Product from "./Pages/Product";
import CartBtn from "./Components/CartButton";
import Signup from "./Pages/Signup";
import Layout from "./Layout";
import Error from "./Pages/Error";
import Profile from "./Pages/Profile";
import { CartProvider } from "./CartContext";
import Delivery from "./Pages/Delivery";
import ProtectedRoute from "./Components/ProtectedRoutes";
import { UserProvider } from "./UserContext";
import ChangePassword from "./Pages/ChangePassword";
import AboutUs from "./Pages/AboutUs";
import PasswordResetFlow from "./Pages/ForgetPassword";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="product" element={<Product />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<Error />} />
              <Route path="changePassword" element={<ChangePassword />} />
              <Route path="aboutUs" element={<AboutUs />} />
              <Route path="forgetPassword" element={<PasswordResetFlow />} />
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<Profile />} />
                <Route path="cart" element={<Cart />} />
                <Route path="order" element={<Order />} />
                <Route path="delivery" element={<Delivery />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
