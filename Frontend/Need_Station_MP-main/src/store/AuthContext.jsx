import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // Fallback: construct user from individual localStorage items
    const username = localStorage.getItem("username");
    const userEmail = localStorage.getItem("userEmail");
    const userPhone = localStorage.getItem("userPhone");
    
    if (username) {
      return { 
        username,
        email: userEmail,
        phone: userPhone
      };
    }
    
    return null;
  });

  const login = (username) => {
    // Get additional user data from localStorage
    const userEmail = localStorage.getItem("userEmail");
    const userPhone = localStorage.getItem("userPhone");
    
    const user = { 
      username,
      email: userEmail,
      phone: userPhone
    };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
