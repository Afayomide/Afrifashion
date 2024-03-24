import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [shouldFetchCart, setShouldFetchCart] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const[authenticated, setAuthenticated] = useState(false)
  const [mainLoading, setMainLoading] = useState(true)


  return (
    <ProductContext.Provider value={{ shouldFetchCart, setShouldFetchCart, shouldSearch, setShouldSearch, authenticated, setAuthenticated, mainLoading, setMainLoading}}>
      {children}
    </ProductContext.Provider>
  );
};