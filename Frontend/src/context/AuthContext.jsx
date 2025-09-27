import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { endpoints } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await endpoints.currentUser();
      setUser(data?.data || data?.user || null);
    } catch (_) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (payload) => {
    const { data } = await endpoints.login(payload);
    const accessToken = data?.data?.accessToken || data?.accessToken || data?.user?.accessToken || data?.data?.user?.accessToken;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    await fetchMe();
    return data;
  }, [fetchMe]);

  const register = useCallback(async (formData) => {
    const { data } = await endpoints.register(formData);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await endpoints.logout(); } catch (_) {}
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}




