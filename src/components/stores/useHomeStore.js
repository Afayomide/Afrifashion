import { create } from "zustand";
import axios from "axios";
import { applyExchangeRate } from "../currency/exchangeRate";


const useHomeStore = create((set, get) => ({
  lace: JSON.parse(localStorage.getItem("lace")) || [],
  asoOke: JSON.parse(localStorage.getItem("asoOke")) || [],
  dansiki: JSON.parse(localStorage.getItem("dansiki")) || [],
  ankara: JSON.parse(localStorage.getItem("ankara")) || [],
  gele: JSON.parse(localStorage.getItem("gele")) || [],
  isLoading: true,

  fetchData: async (exchangeRate) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/clothespreview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const rawData = response.data.previewData;

      // Apply exchange rate to all categories
      const newData = {
        asoOke: applyExchangeRate(rawData.asoOke, exchangeRate),
        lace: applyExchangeRate(rawData.lace, exchangeRate),
        dansiki: applyExchangeRate(rawData.dansiki, exchangeRate),
        gele: applyExchangeRate(rawData.gele, exchangeRate),
        ankara: applyExchangeRate(rawData.ankara, exchangeRate),
      };

      const currentState = get();

      if (
        JSON.stringify(newData.asoOke) !==
          JSON.stringify(currentState.asoOke) ||
        JSON.stringify(newData.lace) !== JSON.stringify(currentState.lace) ||
        JSON.stringify(newData.dansiki) !==
          JSON.stringify(currentState.dansiki) ||
        JSON.stringify(newData.gele) !== JSON.stringify(currentState.gele) ||
        JSON.stringify(newData.ankara) !== JSON.stringify(currentState.ankara)
      ) {
        localStorage.setItem("asoOke", JSON.stringify(newData.asoOke));
        localStorage.setItem("lace", JSON.stringify(newData.lace));
        localStorage.setItem("dansiki", JSON.stringify(newData.dansiki));
        localStorage.setItem("gele", JSON.stringify(newData.gele));
        localStorage.setItem("ankara", JSON.stringify(newData.ankara));

        set({
          ...newData,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default useHomeStore;
