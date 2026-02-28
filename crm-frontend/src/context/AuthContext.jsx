//crm-frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);

      const decoded = jwtDecode(token);

      setUser({
        name: decoded.name,
        email: decoded.sub,
        role: decoded.role,
        profilePic: decoded.profile_pic
      });
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
  setToken(newToken);

  const decoded = jwtDecode(newToken);

    setUser({
      name: decoded.name,
      email: decoded.sub,
      role: decoded.role,
      profilePic: decoded.profile_pic
  });

  navigate("/dashboard");
  }; 
  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>  
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}