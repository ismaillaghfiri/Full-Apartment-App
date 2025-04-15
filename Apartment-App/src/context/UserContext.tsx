import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  role: "user" | "responsable" | "admin";
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<any>;
  register: (data: {
    username: string;
    password: string;
    role: "user" | "responsable";
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/auth/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data) {
            console.log("User data:", response.data);
            setUser(response.data);
          } else {
            throw new Error("No user data received");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("Attempting login with:", { username });
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        // Navigate based on role
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        return response.data.user;
      } else {
        throw new Error("No token or user data received");
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  const register = async (userData: {
    username: string;
    password: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) => {
    try {
      console.log("Attempting registration with:", {
        username: userData.username,
      });
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );

      console.log("Registration response:", response.data);

      if (response.data.success && response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/");
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
