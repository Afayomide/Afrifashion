import { create } from "zustand";
import axios from "axios";
import { applyExchangeRate } from "../currency/exchangeRate"; // Import your helper function

const getInitialData = (key: string) => 
  typeof window !== "undefined" ? JSON.parse(localStorage.getItem(key) || "[]") : [];

interface FabricStoreState {
  fabricsList: any[];
  isLoading: boolean;
  error: string | null;
  fetchFabrics: (exchangeRate: any) => Promise<void>;
}

const useFabricStore = create<FabricStoreState>((set, get) => ({
  fabricsList: getInitialData("fabricsList"),
  isLoading: false,
  error: null,

  fetchFabrics: async (exchangeRate: any) => {
    set({ isLoading: true });
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(
        `${apiUrl}/api/fabrics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedFabrics = response.data.fabrics;

      // Apply exchange rate to fetched data
      const newFabrics = applyExchangeRate(fetchedFabrics, exchangeRate);

      // Apply exchange rate to fabrics in localStorage if necessary
      const localStorageFabrics =
        getInitialData("fabricsList");
      const newLocalStorageFabrics = applyExchangeRate(
        localStorageFabrics,
        exchangeRate
      );

      // If the fetched data or the localStorage data has changed, update the store
      if (
        JSON.stringify(newFabrics) !== JSON.stringify(get().fabricsList) ||
        JSON.stringify(newLocalStorageFabrics) !==
          JSON.stringify(get().fabricsList)
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem("fabricsList", JSON.stringify(newFabrics));
        }

        set({
          fabricsList: newFabrics,
          error: null,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFabricStore;
