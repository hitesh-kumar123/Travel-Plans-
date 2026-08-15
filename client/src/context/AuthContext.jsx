import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/api/authApi";
import { getErrorMessage } from "../services/api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("packgo_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("packgo_token") || null,
  );
  const [loading, setLoading] = useState(true);

  // Sync token and user in storage
  const setAuthData = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem("packgo_token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("packgo_token");
      setToken(null);
    }

    if (newUser) {
      localStorage.setItem("packgo_user", JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem("packgo_user");
      setUser(null);
    }
  };

  const logout = useCallback(() => {
    setAuthData(null, null);
  }, []);

  // Listen for global auth expired events
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener("packgo_auth_expired", handleAuthExpired);
    return () =>
      window.removeEventListener("packgo_auth_expired", handleAuthExpired);
  }, [logout]);

  // Load and verify profile on initial mount
  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem("packgo_token");
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      if (res.data) {
        setUser((prev) => {
          const updated = {
            ...prev,
            ...res.data,
            id: res.data._id || prev?.id,
          };
          localStorage.setItem("packgo_user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn("Could not fetch current profile:", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data?.token && res.data?.user) {
      setAuthData(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error("Invalid login response format");
  };

  const googleLogin = async (credential) => {
    try {
      // Attempt backend authentication
      const res = await authApi.googleAuth(credential);
      if (res.data?.token && res.data?.user) {
        setAuthData(res.data.token, res.data.user);
        return res.data;
      }
    } catch (err) {
      console.warn("Backend /auth/google fallback:", err?.message);
    }

    // Decode Google ID Token payload directly
    try {
      const decoded = jwtDecode(credential);
      const googleUser = {
        id: decoded.sub,
        _id: decoded.sub,
        name: decoded.name || decoded.given_name || "Google Traveler",
        email: decoded.email,
        picture: decoded.picture,
        isVerified: decoded.email_verified || true,
        authProvider: "google",
      };
      setAuthData(credential, googleUser);
      return { token: credential, user: googleUser };
    } catch (decodeErr) {
      console.error("JWT Decode error:", decodeErr);
      throw new Error("Could not parse Google credentials.");
    }
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    if (res.data?.token && res.data?.user) {
      setAuthData(res.data.token, res.data.user);
    }
    return res.data;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("packgo_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        googleLogin,
        register,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
