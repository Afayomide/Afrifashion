import { create } from "zustand";
import axios from "axios";

const useHomeStore = create((set, get) => ({
  lace: [],
  asoOke: [],
  dansiki: [],
  ankara: [],
  gele: [],
  isLoading: true,

  fetchData: async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clothespreview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newData = response.data.previewData;

      // Compare new data with the existing store to prevent unnecessary updates
      if (
        JSON.stringify(newData.asoOke) !== JSON.stringify(get().asoOke) ||
        JSON.stringify(newData.lace) !== JSON.stringify(get().lace) ||
        JSON.stringify(newData.dansiki) !== JSON.stringify(get().dansiki) ||
        JSON.stringify(newData.gele) !== JSON.stringify(get().gele) ||
        JSON.stringify(newData.ankara) !== JSON.stringify(get().ankara)
      ) {
        set({
          asoOke: newData.asoOke,
          lace: newData.lace,
          dansiki: newData.dansiki,
          gele: newData.gele,
          ankara: newData.ankara,
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