import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

const initialLocalLength = JSON.parse(localStorage.getItem('localCartList')) || []

export const ProductProvider = ({ children }) => {
  const [shouldFetchCart, setShouldFetchCart] = useState(true);
  const [shouldSearch, setShouldSearch] = useState(false);
  const[authenticated, setAuthenticated] = useState(false)
  const [mainLoading, setMainLoading] = useState(true)
  const [localCartLength, setLocalCartLength] = useState(initialLocalLength.length)
  const [cartNo, setCartNo] = useState(0)

  return (
    <ProductContext.Provider value={{ cartNo, setCartNo, shouldFetchCart, setShouldFetchCart, shouldSearch, setShouldSearch, authenticated, setAuthenticated, mainLoading, setMainLoading, localCartLength, setLocalCartLength}}>
      {children}
    </ProductContext.Provider>
  );
};