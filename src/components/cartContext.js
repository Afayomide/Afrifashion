import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [shouldFetchCart, setShouldFetchCart] = useState(false);

  return (
    <CartContext.Provider value={{ shouldFetchCart, setShouldFetchCart }}>
      {children}
    </CartContext.Provider>
  );
};