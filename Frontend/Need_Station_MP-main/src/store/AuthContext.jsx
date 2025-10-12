import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to fetch user settings and data from backend
  const fetchUserData = async (token, userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        console.error("Failed to fetch user data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have a token
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (token && userId) {
          // Verify token is still valid by fetching user data
          const userData = await fetchUserData(token, userId);
          
          if (userData) {
            // Token is valid, restore user session
            const storedUser = localStorage.getItem("user");
            const username = localStorage.getItem("username");
            const userEmail = localStorage.getItem("userEmail");
            const userPhone = localStorage.getItem("userPhone");
            
            const restoredUser = storedUser 
              ? JSON.parse(storedUser)
              : {
                  username: username || userData.username || userData.firstName,
                  email: userEmail || userData.email,
                  phone: userPhone || userData.phone,
                  id: userId,
                  ...userData
                };
            
            setUser(restoredUser);
            setIsAuthenticated(true);
            
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(restoredUser));
            localStorage.setItem("username", restoredUser.username);
            localStorage.setItem("userEmail", restoredUser.email || '');
            localStorage.setItem("userPhone", restoredUser.phone || '');
            
            console.log("✅ Session restored successfully");
          } else {
            // Token is invalid, clear everything
            clearSession();
            console.log("❌ Invalid token, session cleared");
          }
        } else {
          // No token found, try to restore from localStorage (fallback)
          const storedUser = localStorage.getItem("user");
          const username = localStorage.getItem("username");
          const userId = localStorage.getItem("userId");
          
          if (storedUser || username) {
            const userEmail = localStorage.getItem("userEmail");
            const userPhone = localStorage.getItem("userPhone");
            const token = localStorage.getItem("token");
            
            let restoredUser;
            if (storedUser) {
              restoredUser = JSON.parse(storedUser);
              // Ensure id and userId are set from localStorage if missing
              if (!restoredUser.id && userId) restoredUser.id = userId;
              if (!restoredUser.userId && userId) restoredUser.userId = userId;
            } else {
              restoredUser = { 
                username, 
                email: userEmail, 
                phone: userPhone,
                id: userId,
                userId: userId,
                token: token
              };
            }
            
            setUser(restoredUser);
            setIsAuthenticated(true);
            
            // Update localStorage with complete user object
            localStorage.setItem("user", JSON.stringify(restoredUser));
            
            console.log("✅ Session restored from localStorage", restoredUser);
          }
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const clearSession = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("workerId");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
  };

  const login = (username, additionalData = {}) => {
    // Get additional user data from localStorage
    const userEmail = localStorage.getItem("userEmail");
    const userPhone = localStorage.getItem("userPhone");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    console.log("🔐 AuthContext login called with:", {
      username,
      additionalData,
      fromLocalStorage: {
        userEmail,
        userPhone,
        userId,
        token
      }
    });
    
    const user = { 
      username,
      email: userEmail || additionalData.email,
      phone: userPhone || additionalData.phone,
      id: userId || additionalData.id || additionalData.userId,
      userId: userId || additionalData.id || additionalData.userId,
      token: token || additionalData.token,
      ...additionalData
    };
    
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(user));
    
    console.log("✅ User logged in successfully:", user);
  };

  const logout = () => {
    clearSession();
    console.log("✅ User logged out");
    
    // Redirect to home page after logout
    // Check if we're on a protected page (profile, bookings, settings, notifications)
    const protectedPages = ['/profile', '/bookings', '/settings', '/notifications'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.some(page => currentPath.includes(page))) {
      console.log("🏠 Redirecting to home page from protected page");
      window.location.href = '/';
    }
  };

  // Update user data (for profile updates, settings changes, etc.)
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update individual localStorage items if they changed
    if (updatedData.username) localStorage.setItem("username", updatedData.username);
    if (updatedData.email) localStorage.setItem("userEmail", updatedData.email);
    if (updatedData.phone) localStorage.setItem("userPhone", updatedData.phone);
    
    console.log("✅ User data updated");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isLoading,
      login, 
      logout,
      updateUser,
      fetchUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
