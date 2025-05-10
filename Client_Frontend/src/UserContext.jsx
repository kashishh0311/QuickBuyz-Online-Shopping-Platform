import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/v1/user/getUserDetails", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error.response?.data || error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/v1/user/login", credentials, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setUser(response.data.data);
      await fetchUser(); // Sync with backend immediately after login
      return response.data.data; // Return user data for immediate use
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "/api/v1/user/logout",
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
