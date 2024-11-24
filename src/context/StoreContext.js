import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const StoreContext = createContext();

// Provider component
export function StoreProvider({ children }) {
  const [storeName, setStoreName] = useState("");

  // Load the initial storeName from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("storeName") || "";
    setStoreName(storedName);
  }, []);

  // Update localStorage whenever storeName changes
  useEffect(() => {
    if (storeName) {
      localStorage.setItem("storeName", storeName);
    }
  }, [storeName]);

  return (
    <StoreContext.Provider value={{ storeName, setStoreName }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use the store context
export function useStore() {
  return useContext(StoreContext);
}
