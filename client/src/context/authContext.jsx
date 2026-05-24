import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMeApi,
  loginCustomerApi,
  loginSellerApi,
  logoutApi,
  registerCustomerApi,
  registerSellerApi,
} from "../api/authApi.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const hydrateUser = async () => {
    try {
      const data = await getMeApi();
      setUser(data.user);
      setSeller(data.seller || null);
    } catch (error) {
      setUser(null);
      setSeller(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  const runAuthAction = async (action) => {
    setAuthError("");
    setLoading(true);

    try {
      const data = await action();
      setUser(data.user);
      setSeller(data.seller || null);
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginCustomer = (payload) => runAuthAction(() => loginCustomerApi(payload));
  const loginSeller = (payload) => runAuthAction(() => loginSellerApi(payload));
  const registerCustomer = (payload) => runAuthAction(() => registerCustomerApi(payload));
  const registerSeller = (payload) => runAuthAction(() => registerSellerApi(payload));

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setSeller(null);
      setAuthError("");
    }
  };

  const value = useMemo(() => ({
    user,
    seller,
    loading,
    authError,
    loginCustomer,
    loginSeller,
    registerCustomer,
    registerSeller,
    logout,
  }), [user, seller, loading, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
