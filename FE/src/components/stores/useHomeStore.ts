import { create } from "zustand";
import axios from "axios";
import { applyExchangeRate } from "../currency/exchangeRate";

const getInitialData = (key: string) => 
  typeof window !== "undefined" ? JSON.parse(localStorage.getItem(key) || "[]") : [];

interface HomeStoreState {
  lace: any[];
  asoOke: any[];
  dansiki: any[];
  ankara: any[];
  gele: any[];
  isLoading: boolean;
  fetchData: (exchangeRate: any) => Promise<void>;
}

const useHomeStore = create<HomeStoreState>((set, get) => ({
  lace: getInitialData("lace"),
  asoOke: getInitialData("asoOke"),
  dansiki: getInitialData("dansiki"),
  ankara: getInitialData("ankara"),
  gele: getInitialData("gele"),
  isLoading: false,

  fetchData: async (exchangeRate: any) => {
    set({ isLoading: true });
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(
        `${apiUrl}/api/clothespreview`,
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
        if (typeof window !== "undefined") {
          localStorage.setItem("asoOke", JSON.stringify(newData.asoOke));
          localStorage.setItem("lace", JSON.stringify(newData.lace));
          localStorage.setItem("dansiki", JSON.stringify(newData.dansiki));
          localStorage.setItem("gele", JSON.stringify(newData.gele));
          localStorage.setItem("ankara", JSON.stringify(newData.ankara));
        }

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
