"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Helper to decode JWT payload
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const parsed = parseJwt(storedToken);
      setPayload(parsed);
    }
  }, []);

  return (
    <MyContext.Provider value={{ token, payload, setToken }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
