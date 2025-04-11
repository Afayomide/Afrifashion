import { create } from "zustand";
import axios from "axios";
import { applyExchangeRate } from "../currency/exchangeRate"; // Import your helper function

const useFabricStore = create((set, get) => ({
  fabricsList: JSON.parse(localStorage.getItem("fabricsList")) || [],
  isLoading: true,
  error: null,

  fetchFabrics: async (exchangeRate) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/fabrics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedFabrics = response.data.fabrics;

      // Apply exchange rate to fetched data
      const newFabrics = applyExchangeRate(fetchedFabrics, exchangeRate);

      // Apply exchange rate to fabrics in localStorage if necessary
      const localStorageFabrics =
        JSON.parse(localStorage.getItem("fabricsList")) || [];
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
        localStorage.setItem("fabricsList", JSON.stringify(newFabrics));

        set({
          fabricsList: newFabrics,
          error: null,
        });
      }
    } catch (error) {
      set({ error: error.message || "An error occurred." });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFabricStore;
