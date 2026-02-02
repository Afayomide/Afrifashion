"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductProvider } from "./productContext";
import { CurrencyProvider } from "./currency/currencyContext";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <ProductProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                className: "",
                duration: 5000,
                style: {
                  background: "#ffd79f",
                  color: "#00000",
                },
              }}
            />
            {children}
        </ProductProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}
