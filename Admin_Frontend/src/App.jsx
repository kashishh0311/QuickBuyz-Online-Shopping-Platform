import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
import Products from "./Pages/Products";
import Order from "./Pages/Order";
import Users from "./Pages/Users";
import Login from "./Pages/Login";
import Error from "./Pages/Error";

import { AdminProvider } from "./AdminContext";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Feedback from "./Pages/FeedBack";
import PasswordResetFlow from "./Pages/ForgetPassword";
function App() {
  return (
    <>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="forgetPassword" element={<PasswordResetFlow />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<Error />} />
              <Route element={<ProtectedRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="product" element={<Products />} />
                <Route path="order" element={<Order />} />
                <Route path="users" element={<Users />} />
                <Route path="feedback" element={<Feedback />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </>
  );
}

export default App;
