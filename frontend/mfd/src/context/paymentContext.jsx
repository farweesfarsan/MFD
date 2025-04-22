
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const PaymentContext = createContext();

// Custom hook
export const usePayment = () => useContext(PaymentContext);

// Provider component
export const PaymentProvider = ({ children }) => {
  // ✅ Initialize state from sessionStorage (or localStorage)
  const [paymentMethod, setPaymentMethod] = useState(() => {
    return sessionStorage.getItem("paymentMethod") || "payhere"; // default to payhere or ''
  });

  // ✅ Update sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("paymentMethod", paymentMethod);
  }, [paymentMethod]);

  return (
    <PaymentContext.Provider value={{ paymentMethod, setPaymentMethod }}>
      {children}
    </PaymentContext.Provider>
  );
};
